package com.mtgcards.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CardFaceDto(
        int face,
        String name,
        String manaCost,
        String typeLine,
        String oracleText,
        String flavorText,
        String power,
        String toughness
) {}
