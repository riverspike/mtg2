package com.mtgcards.controller;

import com.mtgcards.dto.CollectionCardDto;
import com.mtgcards.repository.CollectionRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CollectionController {

    private final CollectionRepository collectionRepository;

    public CollectionController(CollectionRepository collectionRepository) {
        this.collectionRepository = collectionRepository;
    }

    @GetMapping("/collection")
    public List<CollectionCardDto> getCollection() {
        return collectionRepository.findAll();
    }
}
