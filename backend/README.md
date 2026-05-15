# MTG Cards Backend

Spring Boot REST API for the MTG card collection app. Connects to a MySQL 8 database populated from a MongoDB export.

Can be run directly on the host (for development) or inside Docker.

---

## Prerequisites

### 1. Java 21
Required for running locally only — not needed if running in Docker.

- Install via winget: `winget install Amazon.Corretto.21.JDK`
- Or download: https://corretto.aws/downloads/latest/amazon-corretto-21-x64-windows-jdk.msi
- Verify: `java -version`

### 2. Apache Maven 3.9+
Required for building locally only — the Docker image builds itself using the Maven image.

**Manual install (used in this project):**
```
# Download from https://maven.apache.org/download.cgi
# Extract to C:\tools\maven\
# Add C:\tools\maven\apache-maven-3.9.x\bin to your PATH
```
- Verify: `mvn -version`

### 3. Docker Desktop
Required for running in Docker or starting the database.

- Download: https://www.docker.com/products/docker-desktop/
- Verify: `docker --version`

### 4. MySQL 8 database
See [Run in Docker (full stack)](#run-in-docker-full-stack) below to start everything at once,
or [Database only](#database-only) to start just the database for local development.

Database credentials:

| Setting  | Value       |
|----------|-------------|
| Host     | localhost   |
| Port     | 3306        |
| Database | mtgcards2   |
| User     | mtguser     |
| Password | mtgpassword |

> To populate the database after first start, run: `cd ../../../mtg2db && python migrate.py`

---

## Run in Docker (full stack)

Starts both MySQL and the backend in one command from the `mtg2/` folder:

```bash
cd mtg2
docker compose up -d
```

The backend is available at **http://localhost:8080**.

To rebuild the backend image after a code change:
```bash
docker compose up -d --build backend
```

To stop everything:
```bash
docker compose down
```

> **Note:** Do not run this at the same time as `mtg2db/docker-compose.yml` — both use port 3306 and the same container name.

---

## Run Locally (development)

### Database only

```bash
cd mtg2db
docker compose up -d
```

### Build

```bash
cd mtg2/backend
mvn package
```

The compiled JAR is written to `target/mtgcards-backend-0.0.1-SNAPSHOT.jar`.

### Run

```bash
java -jar target/mtgcards-backend-0.0.1-SNAPSHOT.jar
```

Or without packaging first:
```bash
mvn spring-boot:run
```

The server starts on **http://localhost:8080**.

---

## Configuration

Connection settings are in `src/main/resources/application.properties` and read from environment variables with localhost defaults:

| Env var       | Default     | Description       |
|---------------|-------------|-------------------|
| `DB_HOST`     | `localhost` | Database hostname |
| `DB_PORT`     | `3306`      | Database port     |
| `DB_USER`     | `mtguser`   | Database user     |
| `DB_PASSWORD` | `mtgpassword` | Database password |

The Docker Compose file sets `DB_HOST=mysql` automatically so the backend finds the database by service name inside the container network.

---

## API Endpoints

### `GET /api/locations`
Returns all storage locations and decks for the location dropdown.

**Response** — array of location objects:
```json
[
  { "locationId": 1, "name": "Forgotten Realms", "type": "storage" },
  { "locationId": 2, "name": "Slivers",           "type": "deck"    }
]
```

---

### `POST /api/collection`
Adds a card to the collection. If the card does not yet exist in the `cards` table it is inserted first (upsert). If the card already exists in the collection the quantity is incremented.

**Request body:**
```json
{
  "cardId":          "e882c9f9-bf30-46b6-bedc-379d2c80e5cb",
  "setId":           "d5b99bde-9e8e-4474-8c9e-8c2b18efb1e4",
  "setCode":         "afr",
  "setName":         "Adventures in the Forgotten Realms",
  "name":            "+2 Mace",
  "manaCost":        "{1}{W}",
  "cmc":             2.0,
  "typeLine":        "Artifact — Equipment",
  "rarity":          "common",
  "oracleText":      "Equipped creature gets +2/+2.\nEquip {3}",
  "power":           null,
  "toughness":       null,
  "artist":          "Jarel Threat",
  "flavorText":      null,
  "collectorNumber": "3",
  "imageNormal":     "https://c1.scryfall.com/file/scryfall-cards/normal/...",
  "imageNormalBack": null,
  "colors":          ["W"],
  "faces":           null,
  "usd":             0.12,
  "usdFoil":         null,
  "locationId":      1,
  "quantity":        1,
  "isFoil":          false
}
```

`cardId`, `setId`, `setCode`, `setName`, `name`, `rarity`, `locationId`, and `quantity` are required. All other card fields are optional.

**Response:** `201 Created` (no body)

**Transaction behaviour:** all inserts (set, card, images, colors, faces, prices, collection, collection_locations) run in a single transaction and roll back together on failure.

---

### `POST /api/prices/update`
Downloads Scryfall's `default_cards` bulk data file (updated every 12 hours) and stream-parses it to update `usd` and `usd_foil` in the `card_prices` table for every card in the collection. Uses a single bulk download instead of per-card API calls to avoid rate limiting. Matching cards are written in batches of 500 via `jdbc.batchUpdate()`.

**Response:**
```json
{ "updated": 1847 }
```
`updated` is the number of collection cards whose prices were found in the bulk file and written.

> This request downloads ~300 MB and streams through ~70 k card objects. Expect it to take 30–90 seconds depending on network speed.

---

### `GET /api/sets`
Returns all card sets from the `sets` table, sorted alphabetically by name.

**Response** — array of set objects:
```json
[
  { "code": "afr", "name": "Adventures in the Forgotten Realms" },
  { "code": "eld", "name": "Throne of Eldraine" }
]
```

---

### `POST /api/sets/update`
Fetches the full list of card sets from Scryfall (`https://api.scryfall.com/sets`) and upserts each set into the `sets` table.

**Response:**
```json
{ "total": 1038, "added": 3 }
```
`total` is the number of sets now in the database. `added` is the number that were newly inserted this run.

---

### `GET /api/collection`
Returns all cards in the collection.

**Response** — array of card objects:
```json
[
  {
    "id": 162,
    "cardId": "e882c9f9-bf30-46b6-bedc-379d2c80e5cb",
    "isFoil": false,
    "quantity": 5,
    "timeUpdated": "2021-10-10T15:51:30",
    "name": "+2 Mace",
    "manaCost": "{1}{W}",
    "cmc": 2.0,
    "typeLine": "Artifact — Equipment",
    "rarity": "common",
    "oracleText": "Equipped creature gets +2/+2.\nEquip {3}",
    "power": null,
    "toughness": null,
    "artist": "Jarel Threat",
    "flavorText": "The weight of this magic weapon falls heavy on the wicked.",
    "setCode": "afr",
    "setName": "Adventures in the Forgotten Realms",
    "imageNormal": "https://c1.scryfall.com/file/scryfall-cards/normal/...",
    "imageNormalBack": null,
    "colors": "W",
    "collectorNumber": "3",
    "locations": "Binder,Box",
    "usd": 0.12,
    "usdFoil": null,
    "priceUpdatedAt": "2024-01-15",
    "faces": null
  }
]
```

For double-sided cards (transform / modal_dfc):
- `imageNormal` — front face image; `imageNormalBack` — back face image (`null` for single-faced cards)
- `faces` — array of per-face objects sorted by face index (0 = front, 1 = back), each containing `face`, `name`, `manaCost`, `typeLine`, `oracleText`, `flavorText`, `power`, `toughness`; `null` for single-faced cards

```json
"faces": [
  {
    "face": 0,
    "name": "Afflicted Deserter",
    "manaCost": "{3}{R}",
    "typeLine": "Creature — Human Werewolf",
    "oracleText": "At the beginning of each upkeep...",
    "flavorText": "The rising of the first full moon...",
    "power": "3",
    "toughness": "2"
  },
  {
    "face": 1,
    "name": "Werewolf Ransacker",
    "manaCost": null,
    "typeLine": "Creature — Werewolf",
    "oracleText": "Whenever this creature transforms...",
    "flavorText": null,
    "power": "5",
    "toughness": "4"
  }
]
```

---

## Project Structure

```
backend/
├── Dockerfile                                       Multi-stage build (Maven → JRE Alpine)
├── .dockerignore
├── pom.xml                                          Maven build (Spring Boot 3.5.13)
└── src/main/
    ├── java/com/mtgcards/
    │   ├── MtgCardsApplication.java                 Entry point
    │   ├── controller/
    │   │   ├── CollectionController.java            GET /api/collection, POST /api/collection
    │   │   ├── LocationController.java              GET /api/locations
    │   │   ├── PriceController.java                 POST /api/prices/update
    │   │   └── SetController.java                   GET /api/sets, POST /api/sets/update
    │   ├── dto/
    │   │   ├── AddCardRequest.java                  POST /api/collection request body
    │   │   ├── CardFaceDto.java                     Per-face data (DFC cards)
    │   │   ├── CollectionCardDto.java               GET /api/collection response shape
    │   │   ├── LocationDto.java                     GET /api/locations response shape
    │   │   ├── SetDto.java                          GET /api/sets response shape
    │   │   ├── ScryfallBulkDataDto.java             Scryfall bulk-data metadata (download_uri, size)
    │   │   ├── ScryfallSetDto.java                  Scryfall /sets response — individual set
    │   │   └── ScryfallSetResponse.java             Scryfall /sets response — wrapper
    │   ├── repository/
    │   │   ├── CollectionRepository.java            findAll() — JdbcTemplate data access
    │   │   └── LocationRepository.java              findAll() — location lookup
    │   └── service/
    │       ├── CollectionService.java               addCard() — transactional card upsert
    │       ├── PriceService.java                    updatePrices() — bulk-data download + stream parse
    │       └── SetService.java                      updateSets() / getAllSets()
    └── resources/
        └── application.properties                   DB connection (env vars) + server port
```

---

## Tech Stack

| Layer      | Technology                 | Version  |
|------------|----------------------------|----------|
| Language   | Java                       | 21       |
| Framework  | Spring Boot                | 3.5.13   |
| Web        | Spring Web (Tomcat)        | embedded |
| Data       | Spring JDBC (JdbcTemplate) | —        |
| Database   | MySQL                      | 8.0      |
| Driver     | mysql-connector-j          | managed by Spring Boot |
| Build      | Maven                      | 3.9+     |
| Runtime image | eclipse-temurin:21-jre-alpine | — |
| Build image | maven:3.9-eclipse-temurin-21 | — |
