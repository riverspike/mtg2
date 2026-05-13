package com.mtgcards.dto;

import java.util.List;

public record AddCardRequest(
        // Card data from Scryfall
        String cardId,
        String setId,
        String setCode,
        String setName,
        String name,
        String manaCost,
        Double cmc,
        String typeLine,
        String rarity,
        String oracleText,
        String power,
        String toughness,
        String artist,
        String flavorText,
        String collectorNumber,
        String imageNormal,
        String imageNormalBack,
        List<String> colors,
        List<CardFaceDto> faces,
        Double usd,
        Double usdFoil,
        // User choices
        int locationId,
        int quantity,
        boolean isFoil
) {}
