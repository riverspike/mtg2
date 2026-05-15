package com.mtgcards.controller;

import com.mtgcards.dto.CreateLocationRequest;
import com.mtgcards.dto.LocationDto;
import com.mtgcards.dto.UpdateLocationRequest;
import com.mtgcards.repository.LocationRepository;
import com.mtgcards.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LocationController {

    private final LocationRepository locationRepository;
    private final LocationService    locationService;

    public LocationController(LocationRepository locationRepository,
                              LocationService locationService) {
        this.locationRepository = locationRepository;
        this.locationService    = locationService;
    }

    @GetMapping("/locations")
    public List<LocationDto> getLocations() {
        return locationRepository.findAll();
    }

    @GetMapping("/locations/empty")
    public List<LocationDto> getEmptyLocations() {
        return locationRepository.findEmpty();
    }

    @PostMapping("/locations")
    public ResponseEntity<?> createLocation(@RequestBody CreateLocationRequest request) {
        try {
            locationService.createLocation(request);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/locations/{id}")
    public ResponseEntity<?> renameLocation(@PathVariable int id,
                                            @RequestBody UpdateLocationRequest request) {
        try {
            locationService.renameLocation(id, request);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<?> deleteLocation(@PathVariable int id) {
        try {
            locationService.deleteLocation(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
