package com.mtgcards.controller;

import com.mtgcards.dto.AddCardRequest;
import com.mtgcards.dto.CollectionCardDto;
import com.mtgcards.repository.CollectionRepository;
import com.mtgcards.service.CollectionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
