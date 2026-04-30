# MTG Collection App

## Database Tables

### sets

| Column | Data Type | Name | Description |
|--------|-----------|------|-------------|
| set_id | BINARY(16) | Set ID | |
| code | VARCHAR(10) | Set Code | Short code for the set |
| name | VARCHAR(120) | Set Name | Name of the set |
| set_type | VARCHAR(40) | Set Type | Type of set |
| released_at | DATE | Released Date | Date the set was released |
| scryfall_uri | VARCHAR(512) | Scryfall URI | |
| api_uri | VARCHAR(512) | Scryfall API URI | |
| search_uri | VARCHAR(512) | Scryfall Search URI | |

---

### cards

| Column | Data Type | Name | Description |
|--------|-----------|------|-------------|
| card_id | BINARY(16) | Card ID | |
| oracle_id | BINARY(16) | Oracle ID | |
| set_id | BINARY(16) | Set ID | Foreign key to the sets table |
| name | VARCHAR(255) | Card Name | Name of the card |
| lang | CHAR(3) | Language | Language used for card text |
| collector_number | VARCHAR(10) | Collector Number | Collector number from the set |
| released_at | DATE | Date Released | Date this printing was released |
| layout | VARCHAR(40) | Layout Type | Layout type of the card |
| mana_cost | VARCHAR(60) | Mana Cost | Mana cost |
| cmc | DECIMAL(5,2) | CMC | Converted mana cost |
| type_line | VARCHAR(255) | Type Line | Card type line text |
| oracle_text | TEXT | Oracle Text | Oracle rules text |
| power | VARCHAR(10) | Power | Power of card if applicable |
| toughness | VARCHAR(10) | Toughness | Toughness of card if applicable |
| rarity | VARCHAR(20) | Rarity | Rarity |
| flavor_text | TEXT | Flavor Text | Flavor text |
| artist | VARCHAR(120) | Artist | Artist |
| illustration_id | BINARY(16) | Illustration ID | |
| border_color | VARCHAR(20) | Border Color | Border color |
| frame | VARCHAR(10) | Frame | |
| edhrec_rank | INT | EDH Rank | |
| tcgplayer_id | INT | TCGPlayer ID | |
| mtgo_id | INT | MTGO ID | |
| arena_id | INT | Arena ID | |
| cardmarket_id | INT | Cardmarket ID | |
| reserved | BOOLEAN | Reserved | |
| foil | BOOLEAN | Foil | Whether this card is available in foil |
| nonfoil | BOOLEAN | Non-Foil | Whether this card is available in non-foil |
| oversized | BOOLEAN | Oversized | Oversized card |
| promo | BOOLEAN | Promo | |
| reprint | BOOLEAN | Reprint | |
| digital | BOOLEAN | Digital | |
| full_art | BOOLEAN | Full Art | |
| textless | BOOLEAN | Textless | |
| booster | BOOLEAN | Booster | |
| story_spotlight | BOOLEAN | Story Spotlight | |
| highres_image | BOOLEAN | High Resolution Image | |
| image_status | VARCHAR(30) | Image Status | |
| card_back_id | BINARY(16) | Card Back ID | |
| related_uris | JSON | Related URIs | |
| purchase_uris | JSON | Purchase URIs | |
| extra_ids | JSON | Extra IDs | |

---

### card_colors

| Column | Data Type | Name | Description |
|--------|-----------|------|-------------|
| card_id | BINARY(16) | Card ID | |
| color | CHAR(1) | Color | |
| is_identity | BOOLEAN | Is Identity | |

---

### card_keywords

| Column | Data Type | Name | Description |
|--------|-----------|------|-------------|
| card_id | BINARY(16) | Card ID | |
| keyword | VARCHAR(80) | Keyword | Keyword abilities (Flying, Deathtouch, etc.) |

---

### card_legalities

| Column | Data Type | Name | Description |
|--------|-----------|------|-------------|
| card_id | BINARY(16) | Card ID | |
| format | VARCHAR(40) | Game Format | |
| status | VARCHAR(20) | Legality | |

---

### card_images

| Column | Data Type | Name | Description |
|--------|-----------|------|-------------|
| card_id | BINARY(16) | Card ID | |
| face | TINYINT | Face | 0 = front, 1 = back (double-sided cards) |
| image_type | VARCHAR(20) | Image Type | small, normal, large, png, art_crop, border_crop |
| uri | VARCHAR(512) | URI | |

---

### card_prices

| Column | Data Type | Name | Description |
|--------|-----------|------|-------------|
| card_id | BINARY(16) | Card ID | |
| usd | DECIMAL(10,2) | USD Value | |
| usd_foil | DECIMAL(10,2) | USD Foil Value | |
| usd_etched | DECIMAL(10,2) | USD Etched Value | |
| eur | DECIMAL(10,2) | EUR Value | |
| eur_foil | DECIMAL(10,2) | EUR Foil Value | |
| tix | DECIMAL(10,2) | TIX Value | |
| updated_at | TIMESTAMP | Last Updated | |

---

### collection

| Column | Data Type | Name | Description |
|--------|-----------|------|-------------|
| collection_id | INT | Collection ID | |
| card_id | BINARY(16) | Card ID | |
| is_foil | BOOLEAN | Foil | Whether this owned copy is foil |
| quantity | INT | Quantity | Total copies owned |
| updated_at | DATETIME | Last Updated | |

---

### locations

| Column | Data Type | Name | Description |
|--------|-----------|------|-------------|
| location_id | INT | Location ID | |
| location_key | VARCHAR(80) | Location Key | Human-readable slug (e.g. storage_box_1) |
| name | VARCHAR(120) | Location Name | Display name of the location |
| type | VARCHAR(40) | Location Type | Type of location (deck, storage, etc.) |

---

### collection_locations

| Column | Data Type | Name | Description |
|--------|-----------|------|-------------|
| collection_id | INT | Collection ID | Foreign key to the collection table |
| location_id | INT | Location ID | Foreign key to the locations table |
| quantity | INT | Quantity | Number of copies at this location |
