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
                "SELECT location_id, name, type FROM locations ORDER BY name",
                this::mapRow
        );
    }

    public List<LocationDto> findEmpty() {
        return jdbc.query("""
                SELECT location_id, name, type FROM locations l
                WHERE NOT EXISTS (
                    SELECT 1 FROM collection_locations cl WHERE cl.location_id = l.location_id
                )
                ORDER BY name
                """,
                this::mapRow
        );
    }

    private LocationDto mapRow(java.sql.ResultSet rs, int rowNum) throws java.sql.SQLException {
        return new LocationDto(
                rs.getInt("location_id"),
                rs.getString("name"),
                rs.getString("type")
        );
    }
}
