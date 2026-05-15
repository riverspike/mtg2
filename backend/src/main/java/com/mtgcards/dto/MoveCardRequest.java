package com.mtgcards.dto;

public record MoveCardRequest(int fromLocationId, int toLocationId, int quantity) {}
