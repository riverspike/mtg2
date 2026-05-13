package com.mtgcards.repository;

import com.mtgcards.dto.LocationDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class LocationRepository {

    private final JdbcTemplate jdbc;

    public LocationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<LocationDto> findAll() {
        return jdbc.query(
                "SELECT location_id, location_key, name, type FROM locations ORDER BY name",
                (rs, rowNum) -> new LocationDto(
                        rs.getInt("location_id"),
                        rs.getString("location_key"),
                        rs.getString("name"),
                        rs.getString("type")
                )
        );
    }
}
