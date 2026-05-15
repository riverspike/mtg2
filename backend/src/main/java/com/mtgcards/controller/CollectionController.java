package com.mtgcards.controller;

import com.mtgcards.dto.AddCardRequest;
import com.mtgcards.dto.CollectionCardDto;
import com.mtgcards.dto.MoveCardRequest;
import com.mtgcards.dto.UpdateQuantityRequest;
import com.mtgcards.repository.CollectionRepository;
import com.mtgcards.service.CollectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CollectionController {

    private final CollectionRepository collectionRepository;
    private final CollectionService collectionService;

    public CollectionController(CollectionRepository collectionRepository,
                                CollectionService collectionService) {
        this.collectionRepository = collectionRepository;
        this.collectionService    = collectionService;
    }

    @GetMapping("/collection")
    public List<CollectionCardDto> getCollection() {
        return collectionRepository.findAll();
    }

    @PostMapping("/collection")
    @ResponseStatus(HttpStatus.CREATED)
    public void addCard(@RequestBody AddCardRequest request) {
        collectionService.addCard(request);
    }

    @PatchMapping("/collection/{id}/quantity")
    public ResponseEntity<?> updateQuantity(@PathVariable int id,
                                            @RequestBody UpdateQuantityRequest request) {
        try {
            collectionService.updateQuantity(id, request.quantity());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/collection/{id}/move")
    public ResponseEntity<?> moveCard(@PathVariable int id,
                                      @RequestBody MoveCardRequest request) {
        try {
            collectionService.moveCard(id, request.fromLocationId(), request.toLocationId(), request.quantity());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
