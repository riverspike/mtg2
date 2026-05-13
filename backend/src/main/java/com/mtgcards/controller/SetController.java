package com.mtgcards.controller;

import com.mtgcards.dto.SetDto;
import com.mtgcards.service.SetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SetController {

    private final SetService setService;

    public SetController(SetService setService) {
        this.setService = setService;
    }

    @GetMapping("/sets")
    public List<SetDto> getAllSets() {
        return setService.getAllSets();
    }

    @PostMapping("/sets/update")
    public Map<String, Integer> updateSets() {
        SetService.UpdateResult result = setService.updateSets();
        return Map.of("added", result.added());
    }
}
