package com.mtgcards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ScryfallSetDto(
        String id,
        String code,
        String name,
        @JsonProperty("set_type")    String setType,
        @JsonProperty("released_at") String releasedAt,
        @JsonProperty("scryfall_uri") String scryfallUri,
        String uri,
        @JsonProperty("search_uri")  String searchUri
) {}
