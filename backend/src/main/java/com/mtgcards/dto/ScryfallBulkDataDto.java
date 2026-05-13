package com.mtgcards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ScryfallBulkDataDto(
        @JsonProperty("download_uri") String downloadUri,
        @JsonProperty("updated_at")   String updatedAt,
        long size
) {}
