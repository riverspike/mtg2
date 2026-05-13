package com.mtgcards.service;

import com.mtgcards.dto.AddCardRequest;
import com.mtgcards.dto.CardFaceDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        jdbc.update("""
                INSERT INTO collection (card_id, is_foil, quantity)
                VALUES (UUID_TO_BIN(?, 1), ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
                """,
                req.cardId(), req.isFoil(), req.quantity());

        Integer id = jdbc.queryForObject("""
                SELECT collection_id FROM collection
                WHERE card_id = UUID_TO_BIN(?, 1) AND is_foil = ?
                """,
                Integer.class,
                req.cardId(), req.isFoil());
        if (id == null) throw new IllegalStateException("collection row not found after upsert");
        return id;
    }

    private void upsertCollectionLocation(int collectionId, int locationId, int quantity) {
        jdbc.update("""
                INSERT INTO collection_locations (collection_id, location_id, quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
                """,
                collectionId, locationId, quantity);
    }
}
