package com.mtgcards.dto;

import java.util.List;

public record ScryfallSetResponse(
        List<ScryfallSetDto> data
) {}
