package com.mtgcards.service;

import com.mtgcards.dto.SetDto;
import com.mtgcards.dto.ScryfallSetDto;
import com.mtgcards.dto.ScryfallSetResponse;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class SetService {

    public record UpdateResult(int total, int added) {}

    private final JdbcTemplate jdbc;
    private final RestTemplate restTemplate;

    public SetService(JdbcTemplate jdbc, RestTemplateBuilder restTemplateBuilder) {
        this.jdbc         = jdbc;
        this.restTemplate = restTemplateBuilder.build();
    }

    public UpdateResult updateSets() {
        ScryfallSetResponse response = restTemplate.getForObject(
                "https://api.scryfall.com/sets", ScryfallSetResponse.class);

        if (response == null || response.data() == null) return new UpdateResult(0, 0);

        Integer before = jdbc.queryForObject("SELECT COUNT(*) FROM sets", Integer.class);
        int countBefore = before != null ? before : 0;

        for (ScryfallSetDto set : response.data()) {
            if (set.id() == null) continue;
            jdbc.update("""
                    INSERT INTO sets
                        (set_id, code, name, set_type, released_at, scryfall_uri, api_uri, search_uri)
                    VALUES
                        (UUID_TO_BIN(?, 1), ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        code         = VALUES(code),
                        name         = VALUES(name),
                        set_type     = VALUES(set_type),
                        released_at  = VALUES(released_at),
                        scryfall_uri = VALUES(scryfall_uri),
                        api_uri      = VALUES(api_uri),
                        search_uri   = VALUES(search_uri)
                    """,
                    set.id(), set.code(), set.name(), set.setType(),
                    set.releasedAt(), set.scryfallUri(), set.uri(), set.searchUri());
        }

        Integer after = jdbc.queryForObject("SELECT COUNT(*) FROM sets", Integer.class);
        int countAfter = after != null ? after : 0;

        return new UpdateResult(countAfter, countAfter - countBefore);
    }

    public List<SetDto> getAllSets() {
        return jdbc.query(
                "SELECT code, name FROM sets ORDER BY name",
                (rs, rowNum) -> new SetDto(rs.getString("code"), rs.getString("name")));
    }
}
