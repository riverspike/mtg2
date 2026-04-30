package com.mtgcards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

public record CollectionCardDto(
        int id,
        String cardId,
        @JsonProperty("isFoil") boolean isFoil,
        int quantity,
        LocalDateTime timeUpdated,
        String name,
        String manaCost,
        double cmc,
        String typeLine,
        String rarity,
        String oracleText,
        String power,
        String toughness,
        String artist,
        String flavorText,
        String setCode,
        String setName,
        String imageNormal,
        String imageNormalBack,
        String colors,
        String collectorNumber,
        String locations,
        Double usd,
        Double usdFoil,
        String priceUpdatedAt,
        List<CardFaceDto> faces   // null for single-sided cards
) {}
