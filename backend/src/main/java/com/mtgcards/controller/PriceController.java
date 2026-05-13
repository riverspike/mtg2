package com.mtgcards.controller;

import com.mtgcards.service.PriceService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PriceController {

    private final PriceService priceService;

    public PriceController(PriceService priceService) {
        this.priceService = priceService;
    }

    @PostMapping("/prices/update")
    public Map<String, Integer> updatePrices() {
        int updated = priceService.updatePrices();
        return Map.of("updated", updated);
    }
}
