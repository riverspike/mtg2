package com.mtgcards.repository;

import com.mtgcards.dto.CardFaceDto;
import com.mtgcards.dto.CollectionCardDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class CollectionRepository {

    private final JdbcTemplate jdbc;

    public CollectionRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final String FIND_ALL_SQL = """
            SELECT
                c.collection_id,
                BIN_TO_UUID(c.card_id, 1)                            AS card_id,
                c.is_foil,
                c.quantity,
                c.updated_at,
                ca.name,
                ca.mana_cost,
                ca.cmc,
                ca.type_line,
                ca.rarity,
                ca.oracle_text,
                ca.power,
                ca.toughness,
                ca.artist,
                ca.flavor_text,
                ca.collector_number,
                s.code                                                AS set_code,
                s.name                                                AS set_name,
                ci_front.uri                                          AS image_normal,
                ci_back.uri                                           AS image_normal_back,
                cp.usd,
                cp.usd_foil,
                DATE_FORMAT(cp.updated_at, '%Y-%m-%d')               AS price_updated_at
            FROM collection c
            JOIN cards ca      ON ca.card_id  = c.card_id
            JOIN sets  s       ON s.set_id    = ca.set_id
            LEFT JOIN card_images ci_front
                ON ci_front.card_id = c.card_id AND ci_front.face = 0 AND ci_front.image_type = 'normal'
            LEFT JOIN card_images ci_back
                ON ci_back.card_id  = c.card_id AND ci_back.face  = 1 AND ci_back.image_type  = 'normal'
            LEFT JOIN card_prices cp ON cp.card_id = c.card_id
            ORDER BY ca.name, c.is_foil
            """;

    public List<CollectionCardDto> findAll() {
        Map<Integer, String> locations = fetchLocations();
        Map<String, String>  colors    = fetchColors();
        Map<String, List<CardFaceDto>> faces = fetchFaces();

        return jdbc.query(FIND_ALL_SQL,
                (rs, rowNum) -> mapRow(rs, locations, colors, faces));
    }

    private Map<Integer, String> fetchLocations() {
        Map<Integer, String> result = new HashMap<>();
        jdbc.query("""
                SELECT cl.collection_id,
                       GROUP_CONCAT(l.name ORDER BY l.name SEPARATOR ',') AS locations
                FROM collection_locations cl
                JOIN locations l ON l.location_id = cl.location_id
                GROUP BY cl.collection_id
                """,
                rs -> result.put(rs.getInt("collection_id"), rs.getString("locations")));
        return result;
    }

    private Map<String, String> fetchColors() {
        Map<String, String> result = new HashMap<>();
        jdbc.query("""
                SELECT BIN_TO_UUID(card_id, 1) AS card_id,
                       GROUP_CONCAT(color ORDER BY color SEPARATOR ',') AS colors
                FROM card_colors
                WHERE is_identity = FALSE
                GROUP BY card_id
                """,
                rs -> result.put(rs.getString("card_id"), rs.getString("colors")));
        return result;
    }

    private Map<String, List<CardFaceDto>> fetchFaces() {
        Map<String, List<CardFaceDto>> result = new HashMap<>();
        jdbc.query("""
                SELECT BIN_TO_UUID(card_id, 1) AS card_id,
                       face, name, mana_cost, type_line, oracle_text, flavor_text, power, toughness
                FROM card_faces
                ORDER BY card_id, face
                """,
                rs -> {
                    String cardId = rs.getString("card_id");
                    result.computeIfAbsent(cardId, k -> new ArrayList<>()).add(new CardFaceDto(
                            rs.getInt("face"),
                            rs.getString("name"),
                            rs.getString("mana_cost"),
                            rs.getString("type_line"),
                            rs.getString("oracle_text"),
                            rs.getString("flavor_text"),
                            rs.getString("power"),
                            rs.getString("toughness")
                    ));
                });
        return result;
    }

    private CollectionCardDto mapRow(ResultSet rs,
                                     Map<Integer, String> locations,
                                     Map<String, String> colors,
                                     Map<String, List<CardFaceDto>> faces) throws SQLException {
        int    collectionId = rs.getInt("collection_id");
        String cardId       = rs.getString("card_id");

        return new CollectionCardDto(
                collectionId,
                cardId,
                rs.getBoolean("is_foil"),
                rs.getInt("quantity"),
                rs.getTimestamp("updated_at") != null
                        ? rs.getTimestamp("updated_at").toLocalDateTime() : null,
                rs.getString("name"),
                rs.getString("mana_cost"),
                rs.getDouble("cmc"),
                rs.getString("type_line"),
                rs.getString("rarity"),
                rs.getString("oracle_text"),
                rs.getString("power"),
                rs.getString("toughness"),
                rs.getString("artist"),
                rs.getString("flavor_text"),
                rs.getString("set_code"),
                rs.getString("set_name"),
                rs.getString("image_normal"),
                rs.getString("image_normal_back"),
                colors.get(cardId),
                rs.getString("collector_number"),
                locations.get(collectionId),
                rs.getObject("usd",      Double.class),
                rs.getObject("usd_foil", Double.class),
                rs.getString("price_updated_at"),
                faces.get(cardId)
        );
    }
}
