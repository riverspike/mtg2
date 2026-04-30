package com.mtgcards.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mtgcards.dto.CardFaceDto;
import com.mtgcards.dto.CollectionCardDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Comparator;
import java.util.List;

@Repository
public class CollectionRepository {

    private final JdbcTemplate  jdbc;
    private final ObjectMapper  objectMapper;

    private static final TypeReference<List<CardFaceDto>> FACE_LIST_TYPE =
            new TypeReference<>() {};

    public CollectionRepository(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc         = jdbc;
        this.objectMapper = objectMapper;
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
                DATE_FORMAT(cp.updated_at, '%Y-%m-%d')               AS price_updated_at,
                (SELECT GROUP_CONCAT(l.name ORDER BY l.name SEPARATOR ',')
                 FROM collection_locations cl
                 JOIN locations l ON l.location_id = cl.location_id
                 WHERE cl.collection_id = c.collection_id)            AS locations,
                (SELECT GROUP_CONCAT(cc.color ORDER BY cc.color SEPARATOR ',')
                 FROM card_colors cc
                 WHERE cc.card_id = c.card_id AND cc.is_identity = FALSE) AS colors,
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'face',       cf.face,
                        'name',       cf.name,
                        'manaCost',   cf.mana_cost,
                        'typeLine',   cf.type_line,
                        'oracleText', cf.oracle_text,
                        'flavorText', cf.flavor_text,
                        'power',      cf.power,
                        'toughness',  cf.toughness
                    )
                 ) FROM card_faces cf WHERE cf.card_id = c.card_id)   AS faces_json
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

    private CollectionCardDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        List<CardFaceDto> faces = null;
        String facesJson = rs.getString("faces_json");
        if (facesJson != null) {
            try {
                faces = objectMapper.readValue(facesJson, FACE_LIST_TYPE);
                faces.sort(Comparator.comparingInt(CardFaceDto::face));
            } catch (Exception e) {
                // leave faces null — non-fatal
            }
        }

        return new CollectionCardDto(
                rs.getInt("collection_id"),
                rs.getString("card_id"),
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
                rs.getString("colors"),
                rs.getString("collector_number"),
                rs.getString("locations"),
                rs.getObject("usd",      Double.class),
                rs.getObject("usd_foil", Double.class),
                rs.getString("price_updated_at"),
                faces
        );
    }

    public List<CollectionCardDto> findAll() {
        return jdbc.query(FIND_ALL_SQL, this::mapRow);
    }
}
