package com.mtgcards.service;

import com.mtgcards.dto.CreateLocationRequest;
import com.mtgcards.dto.UpdateLocationRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

    private final JdbcTemplate jdbc;

    public LocationService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void createLocation(CreateLocationRequest req) {
        String name = req.name().trim();
        String type = req.type().toLowerCase();
        validateUniqueName(name, null);
        jdbc.update(
                "INSERT INTO locations (name, type) VALUES (?, ?)",
                name, type);
    }

    public void renameLocation(int locationId, UpdateLocationRequest req) {
        String name = req.name().trim();
        String type = req.type().toLowerCase();
        validateUniqueName(name, locationId);
        jdbc.update(
                "UPDATE locations SET name = ?, type = ? WHERE location_id = ?",
                name, type, locationId);
    }

    private void validateUniqueName(String name, Integer excludeId) {
        Integer count;
        if (excludeId == null) {
            count = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM locations WHERE LOWER(name) = LOWER(?)",
                    Integer.class, name);
        } else {
            count = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM locations WHERE LOWER(name) = LOWER(?) AND location_id != ?",
                    Integer.class, name, excludeId);
        }
        if (count != null && count > 0)
            throw new IllegalArgumentException(
                    "That location name already exists. Need to choose a unique location name.");
    }

    public void deleteLocation(int locationId) {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM collection_locations WHERE location_id = ?",
                Integer.class, locationId);
        if (count != null && count > 0)
            throw new IllegalArgumentException(
                    "Cannot delete a location that still has cards.");

        jdbc.update("DELETE FROM locations WHERE location_id = ?", locationId);
    }
}
