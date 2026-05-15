package com.mtgcards.service;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mtgcards.dto.ScryfallBulkDataDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;
import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PriceService {

    private static final Logger log = LoggerFactory.getLogger(PriceService.class);
    private static final String BULK_META_URL = "https://api.scryfall.com/bulk-data/default_cards";

    private static final int BATCH_SIZE = 500;

    private final JdbcTemplate  jdbc;
    private final RestTemplate  restTemplate;
    private final ObjectMapper  objectMapper;

    public PriceService(JdbcTemplate jdbc, RestTemplateBuilder restTemplateBuilder, ObjectMapper objectMapper) {
        this.jdbc         = jdbc;
        this.objectMapper = objectMapper;
        this.restTemplate = restTemplateBuilder
                .connectTimeout(Duration.ofSeconds(10))
                .readTimeout(Duration.ofSeconds(30))
                .defaultHeader("User-Agent", "MTGCollectionApp/1.0")
                .defaultHeader("Accept",     "application/json")
                .build();
    }

    public int updatePrices() {
        // ── Step 1: load our card IDs into a lookup set ───────────────────────
        List<String> cardIdList = jdbc.queryForList(
                "SELECT BIN_TO_UUID(card_id, 1) FROM cards", String.class);
        Set<String> cardIds = new HashSet<>(cardIdList);
        log.info("Loaded {} unique card IDs from database", cardIds.size());

        // ── Step 2: get the bulk-data download URL ─────────────────────────────
        log.info("Fetching bulk data metadata from Scryfall...");
        ScryfallBulkDataDto meta = restTemplate.getForObject(BULK_META_URL, ScryfallBulkDataDto.class);
        if (meta == null || meta.downloadUri() == null) {
            log.error("Failed to retrieve bulk data metadata");
            return 0;
        }
        log.info("Bulk data last updated: {}  |  size: {} MB",
                meta.updatedAt(), meta.size() / 1_000_000);
        log.info("Downloading bulk data file...");

        // ── Step 3: stream-parse the bulk JSON and upsert matching prices ─────
        int scanned = 0;
        int updated = 0;
        List<Object[]> batch = new ArrayList<>();
        try (InputStream in  = URI.create(meta.downloadUri()).toURL().openStream();
             JsonParser parser = objectMapper.getFactory().createParser(in)) {

            if (parser.nextToken() != JsonToken.START_ARRAY) {
                log.error("Unexpected bulk data format — expected a JSON array");
                return 0;
            }

            log.info("Streaming bulk data...");
            while (parser.nextToken() != JsonToken.END_ARRAY) {
                JsonNode card = objectMapper.readTree(parser);
                scanned++;

                String id = card.path("id").asText(null);
                if (id != null && cardIds.contains(id)) {
                    String usd     = textOrNull(card.path("prices").path("usd"));
                    String usdFoil = textOrNull(card.path("prices").path("usd_foil"));

                    batch.add(new Object[]{ id, parsePrice(usd), parsePrice(usdFoil) });
                    updated++;

                    if (batch.size() >= BATCH_SIZE) {
                        flushBatch(batch);
                    }
                }

                if (scanned % 10_000 == 0) {
                    log.info("Progress: scanned {} cards, matched {}/{} in collection",
                            scanned, updated, cardIds.size());
                }
            }

            if (!batch.isEmpty()) {
                flushBatch(batch);
            }
        } catch (Exception e) {
            log.error("Error processing bulk data after {} scanned, {} updated: {}",
                    scanned, updated, e.getMessage(), e);
        }

        log.info("Price update complete — scanned {}, updated {}/{} collection cards",
                scanned, updated, cardIds.size());
        return updated;
    }

    private void flushBatch(List<Object[]> batch) {
        jdbc.batchUpdate("""
                INSERT INTO card_prices (card_id, usd, usd_foil)
                VALUES (UUID_TO_BIN(?, 1), ?, ?)
                ON DUPLICATE KEY UPDATE
                    usd        = VALUES(usd),
                    usd_foil   = VALUES(usd_foil),
                    updated_at = CURRENT_TIMESTAMP
                """, batch);
        batch.clear();
    }

    private String textOrNull(JsonNode node) {
        return (node.isNull() || node.isMissingNode()) ? null : node.asText();
    }

    private Double parsePrice(String price) {
        if (price == null) return null;
        try {
            return Double.parseDouble(price);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
