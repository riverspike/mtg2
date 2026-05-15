package com.mtgcards.service;

import com.mtgcards.dto.AddCardRequest;
import com.mtgcards.dto.CardFaceDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;

@Service
public class CollectionService {

    private final JdbcTemplate jdbc;

    public CollectionService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional
    public void addCard(AddCardRequest req) {
        upsertSet(req);
        upsertCard(req);
        upsertImages(req);
        upsertColors(req);
        upsertFaces(req);
        upsertPrices(req);
        int collectionId = upsertCollection(req);
        upsertCollectionLocation(collectionId, req.locationId(), req.quantity());
    }

    private void upsertSet(AddCardRequest req) {
        jdbc.update("""
                INSERT IGNORE INTO sets (set_id, code, name)
                VALUES (UUID_TO_BIN(?, 1), ?, ?)
                """,
                req.setId(), req.setCode(), req.setName());
    }

    private void upsertCard(AddCardRequest req) {
        jdbc.update("""
                INSERT IGNORE INTO cards
                    (card_id, set_id, name, mana_cost, cmc, type_line, rarity,
                     oracle_text, power, toughness, artist, flavor_text, collector_number)
                VALUES
                    (UUID_TO_BIN(?, 1),
                     (SELECT set_id FROM sets WHERE code = ?),
                     ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                req.cardId(), req.setCode(),
                req.name(), req.manaCost(), req.cmc(), req.typeLine(), req.rarity(),
                req.oracleText(), req.power(), req.toughness(),
                req.artist(), req.flavorText(), req.collectorNumber());
    }

    private void upsertImages(AddCardRequest req) {
        if (req.imageNormal() != null) {
            jdbc.update("""
                    INSERT IGNORE INTO card_images (card_id, face, image_type, uri)
                    VALUES (UUID_TO_BIN(?, 1), 0, 'normal', ?)
                    """,
                    req.cardId(), req.imageNormal());
        }
        if (req.imageNormalBack() != null) {
            jdbc.update("""
                    INSERT IGNORE INTO card_images (card_id, face, image_type, uri)
                    VALUES (UUID_TO_BIN(?, 1), 1, 'normal', ?)
                    """,
                    req.cardId(), req.imageNormalBack());
        }
    }

    private void upsertColors(AddCardRequest req) {
        if (req.colors() == null) return;
        for (String color : req.colors()) {
            jdbc.update("""
                    INSERT IGNORE INTO card_colors (card_id, color, is_identity)
                    VALUES (UUID_TO_BIN(?, 1), ?, FALSE)
                    """,
                    req.cardId(), color);
        }
    }

    private void upsertFaces(AddCardRequest req) {
        if (req.faces() == null) return;
        for (CardFaceDto face : req.faces()) {
            jdbc.update("""
                    INSERT IGNORE INTO card_faces
                        (card_id, face, name, mana_cost, type_line, oracle_text,
                         flavor_text, power, toughness)
                    VALUES
                        (UUID_TO_BIN(?, 1), ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    req.cardId(), face.face(), face.name(), face.manaCost(),
                    face.typeLine(), face.oracleText(), face.flavorText(),
                    face.power(), face.toughness());
        }
    }

    private void upsertPrices(AddCardRequest req) {
        jdbc.update("""
                INSERT INTO card_prices (card_id, usd, usd_foil)
                VALUES (UUID_TO_BIN(?, 1), ?, ?)
                ON DUPLICATE KEY UPDATE
                    usd        = VALUES(usd),
                    usd_foil   = VALUES(usd_foil),
                    updated_at = CURRENT_TIMESTAMP
                """,
                req.cardId(), req.usd(), req.usdFoil());
    }

    private int upsertCollection(AddCardRequest req) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement("""
                    INSERT INTO collection (card_id, is_foil, quantity)
                    VALUES (UUID_TO_BIN(?, 1), ?, ?)
                    ON DUPLICATE KEY UPDATE
                        quantity      = quantity + VALUES(quantity),
                        collection_id = LAST_INSERT_ID(collection_id)
                    """, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, req.cardId());
            ps.setBoolean(2, req.isFoil());
            ps.setInt(3, req.quantity());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key == null) throw new IllegalStateException("collection row not found after upsert");
        return key.intValue();
    }

    private void upsertCollectionLocation(int collectionId, int locationId, int quantity) {
        jdbc.update("""
                INSERT INTO collection_locations (collection_id, location_id, quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
                """,
                collectionId, locationId, quantity);
    }

    @Transactional
    public void updateQuantity(int collectionId, int quantity) {
        if (quantity < 0) throw new IllegalArgumentException("Quantity cannot be negative");
        if (quantity == 0) {
            jdbc.update("DELETE FROM collection_locations WHERE collection_id = ?", collectionId);
            jdbc.update("DELETE FROM collection WHERE collection_id = ?", collectionId);
        } else {
            jdbc.update("UPDATE collection SET quantity = ? WHERE collection_id = ?", quantity, collectionId);
        }
    }

    @Transactional
    public void moveCard(int collectionId, int fromLocationId, int toLocationId, int quantity) {
        if (fromLocationId == toLocationId)
            throw new IllegalArgumentException("Source and destination locations must be different");
        if (quantity <= 0)
            throw new IllegalArgumentException("Quantity to move must be greater than 0");

        Integer sourceQty = jdbc.queryForObject(
                "SELECT quantity FROM collection_locations WHERE collection_id = ? AND location_id = ?",
                Integer.class, collectionId, fromLocationId);

        if (sourceQty == null)
            throw new IllegalArgumentException("Card not found at the specified source location");
        if (quantity > sourceQty)
            throw new IllegalArgumentException(
                    "Quantity to move (" + quantity + ") exceeds available at source (" + sourceQty + ")");

        if (quantity == sourceQty) {
            jdbc.update("DELETE FROM collection_locations WHERE collection_id = ? AND location_id = ?",
                    collectionId, fromLocationId);
        } else {
            jdbc.update(
                    "UPDATE collection_locations SET quantity = quantity - ? WHERE collection_id = ? AND location_id = ?",
                    quantity, collectionId, fromLocationId);
        }

        jdbc.update("""
                INSERT INTO collection_locations (collection_id, location_id, quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
                """, collectionId, toLocationId, quantity);
    }
}
