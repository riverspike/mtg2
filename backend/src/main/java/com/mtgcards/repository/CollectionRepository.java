package com.mtgcards.repository;

import com.mtgcards.dto.CollectionCardDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CollectionRepository {

    private final JdbcTemplate jdbc;

    public CollectionRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final String FIND_ALL_SQL = """
            SELECT
                c.id,
                BIN_TO_UUID(c.card_id, 1)  AS card_id,
                c.is_foil,
                c.quantity,
                c.time_updated,
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
                s.code                     AS set_code,
                s.name                     AS set_name,
                ci.uri                     AS image_normal
            FROM collection c
            JOIN cards ca ON ca.id = c.card_id
            JOIN sets  s  ON s.id  = ca.set_id
            LEFT JOIN card_images ci
                ON ci.card_id = c.card_id AND ci.image_type = 'normal'
            ORDER BY ca.name, c.is_foil
            """;

    private static final RowMapper<CollectionCardDto> ROW_MAPPER = (rs, rowNum) ->
            new CollectionCardDto(
                    rs.getInt("id"),
                    rs.getString("card_id"),
                    rs.getBoolean("is_foil"),
                    rs.getInt("quantity"),
                    rs.getTimestamp("time_updated") != null
                            ? rs.getTimestamp("time_updated").toLocalDateTime() : null,
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
                    rs.getString("image_normal")
            );

    public List<CollectionCardDto> findAll() {
        return jdbc.query(FIND_ALL_SQL, ROW_MAPPER);
    }
}
