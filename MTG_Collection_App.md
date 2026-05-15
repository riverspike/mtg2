# MTG Collection App

## Database Tables

### sets

| Column | Data Type | Name | Description |
| :---- | :---- | :---- | :---- |
| set\_id | BINARY(16) | Set ID | Foreign key to identify set |
| code | VARCHAR(10) | Set Code | Short code for the set |
| name | VARCHAR(120) | Set Name | Name of the set |
| set\_type | VARCHAR(40) | Set Type | Type of set |
| released\_at | DATE | Released Date | Date the set was released |
| scryfall\_uri | VARCHAR(512) | Scryfall URI |  |
| api\_uri | VARCHAR(512) | Scryfall API URI |  |
| search\_uri | VARCHAR(512) | Scryfall Search URI |  |

---

### cards

| Column | Data Type | Name | Description |
| :---- | :---- | :---- | :---- |
| card\_id | BINARY(16) | Card ID | Foreign key to identify card |
| oracle\_id | BINARY(16) | Oracle ID |  |
| set\_id | BINARY(16) | Set ID | Foreign key to the sets table |
| name | VARCHAR(255) | Card Name | Name of the card |
| lang | CHAR(3) | Language | Language used for card text |
| collector\_number | VARCHAR(10) | Collector Number | Collector number from the set |
| released\_at | DATE | Date Released | Date this printing was released |
| layout | VARCHAR(40) | Layout Type | Layout type of the card |
| mana\_cost | VARCHAR(60) | Mana Cost | Mana cost |
| cmc | DECIMAL(5,2) | CMC | Converted mana cost |
| type\_line | VARCHAR(255) | Type Line | Card type line text |
| oracle\_text | TEXT | Oracle Text | Oracle rules text |
| power | VARCHAR(10) | Power | Power of card if applicable |
| toughness | VARCHAR(10) | Toughness | Toughness of card if applicable |
| rarity | VARCHAR(20) | Rarity | Rarity |
| flavor\_text | TEXT | Flavor Text | Flavor text |
| artist | VARCHAR(120) | Artist | Artist |
| illustration\_id | BINARY(16) | Illustration ID |  |
| border\_color | VARCHAR(20) | Border Color | Border color |
| frame | VARCHAR(10) | Frame |  |
| edhrec\_rank | INT | EDH Rank |  |
| tcgplayer\_id | INT | TCGPlayer ID |  |
| mtgo\_id | INT | MTGO ID |  |
| arena\_id | INT | Arena ID |  |
| cardmarket\_id | INT | Cardmarket ID |  |
| reserved | BOOLEAN | Reserved |  |
| foil | BOOLEAN | Foil | Whether this card is available in foil |
| nonfoil | BOOLEAN | Non-Foil | Whether this card is available in non-foil |
| oversized | BOOLEAN | Oversized | Oversized card |
| promo | BOOLEAN | Promo |  |
| reprint | BOOLEAN | Reprint |  |
| digital | BOOLEAN | Digital |  |
| full\_art | BOOLEAN | Full Art |  |
| textless | BOOLEAN | Textless |  |
| booster | BOOLEAN | Booster |  |
| story\_spotlight | BOOLEAN | Story Spotlight |  |
| highres\_image | BOOLEAN | High Resolution Image |  |
| image\_status | VARCHAR(30) | Image Status |  |
| card\_back\_id | BINARY(16) | Card Back ID |  |
| related\_uris | JSON | Related URIs |  |
| purchase\_uris | JSON | Purchase URIs |  |
| extra\_ids | JSON | Extra IDs |  |

---

### card\_colors

| Column | Data Type | Name | Description |
| :---- | :---- | :---- | :---- |
| card\_id | BINARY(16) | Card ID | Foreign key to the cards table |
| color | CHAR(1) | Color |  |
| is\_identity | BOOLEAN | Is Identity |  |

---

### card\_keywords

| Column | Data Type | Name | Description |
| :---- | :---- | :---- | :---- |
| card\_id | BINARY(16) | Card ID | Foreign key to the cards table |
| keyword | VARCHAR(80) | Keyword | Keyword abilities (Flying, Deathtouch, etc.) |

---

### card\_legalities

| Column | Data Type | Name | Description |
| :---- | :---- | :---- | :---- |
| card\_id | BINARY(16) | Card ID | Foreign key to the cards table |
| format | VARCHAR(40) | Game Format |  |
| status | VARCHAR(20) | Legality |  |

---

### card\_faces

| Column | Data Type | Name | Description |
| :---- | :---- | :---- | :---- |
| card\_id | BINARY(16) | Card ID | Foreign key to the cards table |
| face | TINYINT | Face | 0 = front, 1 = back |
| name | VARCHAR(255) | Face Name | Name of this face |
| mana\_cost | VARCHAR(60) | Mana Cost | Mana cost of this face |
| type\_line | VARCHAR(255) | Type Line | Type line of this face |
| oracle\_text | TEXT | Oracle Text | Oracle rules text of this face |
| flavor\_text | TEXT | Flavor Text | Flavor text of this face |
| power | VARCHAR(10) | Power | Power of this face if applicable |
| toughness | VARCHAR(10) | Toughness | Toughness of this face if applicable |

---

### card\_images

| Column | Data Type | Name | Description |
| :---- | :---- | :---- | :---- |
| card\_id | BINARY(16) | Card ID | Foreign key to the cards table |
| face | TINYINT | Face | 0 \= front, 1 \= back (double-sided cards) |
| image\_type | VARCHAR(20) | Image Type | small, normal, large, png, art\_crop, border\_crop |
| uri | VARCHAR(512) | URI |  |

---

### card\_prices

| Column | Data Type | Name | Description |
| :---- | :---- | :---- | :---- |
| card\_id | BINARY(16) | Card ID | Foreign key to the cards table |
| usd | DECIMAL(10,2) | USD Value |  |
| usd\_foil | DECIMAL(10,2) | USD Foil Value |  |
| usd\_etched | DECIMAL(10,2) | USD Etched Value |  |
| eur | DECIMAL(10,2) | EUR Value |  |
| eur\_foil | DECIMAL(10,2) | EUR Foil Value |  |
| tix | DECIMAL(10,2) | TIX Value |  |
| updated\_at | TIMESTAMP | Last Updated |  |

---

### collection

| Column | Data Type | Name | Description |
| :---- | :---- | :---- | :---- |
| collection\_id | INT | Collection ID | Foreign key to identify collection |
| card\_id | BINARY(16) | Card ID | Foreign key to the cards table |
| is\_foil | BOOLEAN | Foil | Whether this owned copy is foil |
| quantity | INT | Quantity | Total copies owned |
| updated\_at | DATETIME | Last Updated |  |

---

### locations

| Column | Data Type | Name | Description |
| :---- | :---- | :---- | :---- |
| location\_id | INT | Location ID | Auto-increment primary key |
| name | VARCHAR(120) | Location Name | Display name of the location |
| type | VARCHAR(40) | Location Type | Type of location (deck, storage, etc.) |

---

### collection\_locations

| Column | Data Type | Name | Description |
| :---- | :---- | :---- | :---- |
| collection\_id | INT | Collection ID | Foreign key to the collection table |
| location\_id | INT | Location ID | Foreign key to the locations table |
| quantity | INT | Quantity | Number of copies at this location |

# UI Views

## General

### Colors

When a color is indicated, the image for the color should replace the text version.

* The images for mana are located in mtg2/frontend/src/images/mana/  
* Text for colors are indicated with curly brackets {}  
  * Example {R} \= Red Mana \= red-mana.svg  
* Mapping

| Symbol | File |
|--------|------|
| `{W}` | `white-mana.svg` |
| `{U}` | `blue-mana.svg` |
| `{B}` | `black-mana.svg` |
| `{R}` | `red-mana.svg` |
| `{G}` | `green-mana.svg` |
| `{C}` | `colorless-mana.svg` |
| `{T}` | `tap.svg` |
| `{Q}` | `untap.svg` |
| `{E}` | `energy.svg` |
| `{S}` | `snow.svg` |
| `{P}` | `mana-or-life.svg` |
| `{X}` | `x-generic-mana.svg` |
| `{Y}` | `y-generic-mana.svg` |
| `{Z}` | `z-generic-mana.svg` |
| `{PW}` | `planeswalker.svg` |
| `{CHAOS}` | `chaos.svg` |
| `{A}` | `acorn.svg` |
| `{HALF}` | `half-mana.svg` |
| `{INFINITY}` | `infinity-mana.svg` |
| `{HR}` | `half-red.svg` |
| `{HW}` | `half-white.svg` |
| `{W/U}` / `{WU}` | `white-or-blue.svg` |
| `{W/B}` / `{WB}` | `white-or-black.svg` |
| `{U/B}` / `{UB}` | `blue-or-black.svg` |
| `{U/R}` / `{UR}` | `blue-or-red.svg` |
| `{B/R}` / `{BR}` | `black-or-red.svg` |
| `{B/G}` / `{BG}` | `black-or-green.svg` |
| `{R/G}` / `{RG}` | `red-or-green.svg` |
| `{R/W}` / `{RW}` | `red-or-white.svg` |
| `{G/W}` / `{GW}` | `green-or-white.svg` |
| `{G/U}` / `{GU}` | `green-or-blue.svg` |
| `{W/P}` / `{WP}` | `white-or-life.svg` |
| `{U/P}` / `{UP}` | `blue-or-life.svg` |
| `{B/P}` / `{BP}` | `black-or-life.svg` |
| `{R/P}` / `{RP}` | `red-or-life.svg` |
| `{G/P}` / `{GP}` | `green-or-life.svg` |
| `{0}` | `zero-mana.svg` |
| `{1}` | `one-mana.svg` |
| `{2}` | `two-mana.svg` |
| `{3}` | `three-mana.svg` |
| `{4}` | `four-mana.svg` |
| `{5}` | `five-mana.svg` |
| `{6}` | `six-mana.svg` |
| `{7}` | `seven-mana.svg` |
| `{8}` | `eight-mana.svg` |
| `{9}` | `nine-mana.svg` |
| `{10}` | `ten-mana.svg` |
| `{11}` | `eleven-mana.svg` |
| `{12}` | `twelve-mana.svg` |
| `{13}` | `thirteen-mana.svg` |
| `{14}` | `fourteen-mana.svg` |
| `{15}` | `fifteen-mana.svg` |
| `{16}` | `sixteen-mana.svg` |
| `{17}` | `seventeen-mana.svg` |
| `{18}` | `eighteen-mana.svg` |
| `{19}` | `nineteen-mana.svg` |
| `{20}` | `twenty-mana.svg` |
| `{100}` | `one-hundred-mana.svg` |
| `{1000000}` | `one-million-mana.svg` |
| `{2/W}` | `two-generic-or-white.svg` |
| `{2/U}` | `two-generic-or-blue.svg` |
| `{2/B}` | `two-generic-or-black.svg` |
| `{2/R}` | `two-generic-or-red.svg` |
| `{2/G}` | `two-generic-or-green.svg` |

### Images

* The default image for the back of a card is located at mtg2/frontend/src/images/card-back.jpg  
* Double sided cards are the exception and will have a unique front and back

## Home Page

* Navigation tabs at the top for each subheader in this section
  * Default to “**Browse My Collection**”

### Shared

#### Table Columns

The following columns appear in both Browse My Collection and Search MTG Database and are sortable by any column:

| Column | DB Source | Notes |
|--------|-----------|-------|
| Name | cards.name | Click to open card detail pop-up |
| Qty | collection.quantity | |
| Mana | cards.mana\_cost | Displayed as mana icons; sortable by CMC |
| Type | cards.type\_line | |
| Card Set | sets.name | |
| No. | cards.collector\_number | |
| Foil | collection.is\_foil | |
| Location | locations.name | |
| Value | card\_prices.usd / card\_prices.usd\_foil | Non-foil uses usd; foil uses usd\_foil |
| Price Updated | card\_prices.updated\_at | |

* Paginated — rows per page selectable from a dropdown: 50, 100, 150, 200, 500

#### Shared Filters

The following filters appear in both Browse My Collection and Search MTG Database:

* Name — input box
* Mana color(s) — checkboxes: {W}, {U}, {B}, {R}, {G} with mana icons
* Card Set — multi-select dropdown populated from `sets.name`

#### Card Detail Pop-up

Triggered by clicking a card's Name in the table. Displays:

* Name of the card at the top
* Card image(s) — DB: card\_images
  * Single-sided cards: front image only
  * Double-sided cards: front and back shown side-by-side
    * Clicking the front makes it large and the back small, and vice versa
    * Clicking an image toggles between small and large
* Card details below the image(s). Double-sided cards show data for the selected side:
  * Rarity — DB cards.rarity
  * Foil checkbox (read-only) — DB collection.is\_foil
  * Mana cost — DB cards.mana\_cost
  * Type — DB cards.type\_line
  * Oracle Text — DB cards.oracle\_text
  * Flavor Text — DB cards.flavor\_text
  * Power (if not null) — DB cards.power
  * Toughness (if not null) — DB cards.toughness
  * Set name from `sets.name`

---

### Browse My Collection

* Stats bar above the table:
  * Total card count
  * Total value of cards
  * Total cards shown (after filters applied)
  * Total value of cards shown (after filters applied)
* Filters — see Shared Filters, plus:
  * Storage Location — multi-select dropdown using DB locations.name
* Table — see Shared Table Columns
* Card detail pop-up — see Shared Card Detail Pop-up, with an additional section at the bottom:
  * **Edit Card in Collection**
    * Change Quantity in Collection
      * When clicked, show:
        * Text box labeled “New quantity”
        * Button labeled “Update Quantity”
          * Affects only the foil or non-foil version of the card that was selected
          * When clicked:
            * If quantity = 0: delete the row from `collection` and all corresponding rows from `collection_locations` for that `collection_id`. Do not remove anything from `cards`, `card_prices`, `card_colors`, `card_keywords`, `card_legalities`, `card_faces`, `card_images`, or any other card-data tables — those represent the card itself, not ownership.
            * If quantity > 0: update the `quantity` field in the `collection` row for that `collection_id`
    * Move card(s) to new location
      * When clicked, show:
        * Dropdown labeled “New location” (source: `locations` table)
        * Text box labeled “Quantity to move”
        * Button labeled “Update location”
          * Show an error if quantity to move > quantity in the collection or quantity to move = 0
          * If quantity is valid:
            * Source location: decrease `collection_locations.quantity` by the quantity moved for the matching `collection_id` + source `location_id`. If that quantity reaches 0, delete the `collection_locations` row entirely.
            * Destination location: if a `collection_locations` row already exists for the same `collection_id` + destination `location_id`, increase its `quantity` by the quantity moved. If no row exists, insert a new `collection_locations` row.
            * `collection.quantity` does not change — only the per-location distribution changes.

---

### Search MTG Database

* No stats bar
* Filters — see Shared Filters, no Storage Location filter, plus:
  * Search button — sends request to Scryfall (see Scryfall note below)
* Table — see Shared Table Columns; starts empty and is populated by a Scryfall query
* Card detail pop-up — see Shared Card Detail Pop-up, with an additional section at the bottom:
  * **Add to Collection**
    * Location dropdown — required; populated from `locations` table
    * Quantity field — required
    * Foil checkbox (checked = foil, unchecked = not foil)
    * Add button

Refer to https://scryfall.com/docs/api for how to search. Pay attention to any rate limits. If a delay between requests is needed, add a comment in the code pointing to the relevant section of the Scryfall documentation.

### Edit Locations

Buttons for each of the following:

#### Shared Rules

The following rules apply to both Add New Location and Rename Location.

**Location Name input format**
  * Only letters, numbers, and spaces are allowed — no special characters
  * Maximum 60 characters
  * Validate on button click, not in real time

**Name uniqueness**
  * Location Name must be unique, validated against `locations.name`
  * Validation is case-insensitive: "Box A" and "box a" are considered the same
  * If not unique, display in Pop-up text area: "That location name already exists. Need to choose a unique location name."
  * For Rename only: the currently selected location is excluded from this check, so a location may be saved with its existing name without triggering an error

---

#### Add New Location

Open popup with:
  * Close button.
  * Title: Add New Location
  * Input box labeled "Location Name" — see Shared Rules for format and validation
  * Radio button "Location Type"
    * Options
      * Storage (default)
      * Deck
  * Button labeled "Create Location"
    * On click, apply Shared Rules validation
    * If valid, display message in Pop-up text area: "Creating new location..."
    * Create a new row in the "locations" table:
      * `location_id` — standard AUTO\_INCREMENT primary key
      * `name` — the Location Name as entered
      * `type` — Location Type converted to lowercase
    * When created, add a message in the Pop-up text area: "New Location " + Location Name + " created and now usable to add cards."
    * Clear the Location Name input box to allow for a new location to be created
    * Do not clear the Pop-up text
    * Pop-up remains open
  * Pop-up text area to display messages to user


#### Rename Location

Open popup with:
  * Close button.
  * Title: Rename Location
  * Dropdown labeled "Choose Location to Rename"
    * Populated from the "locations" table, sorted alphabetically
    * Single-select
  * When a location is selected from the dropdown:
    * Show input box labeled "Location Name" — see Shared Rules for format and validation
      * Pre-populated with the current name of the selected location
    * Show Radio button "Location Type" with the current type pre-selected
      * Options
        * Storage
        * Deck
    * Button labeled "Update Location"
      * On click, apply Shared Rules validation (excluding the selected location from the uniqueness check)
      * If valid, display message in Pop-up text area: "Updating location..."
      * Update the matching row in the "locations" table:
        * `name` — updated to the new Location Name
        * `type` — updated to the Location Type converted to lowercase
      * When updated, add a message in the Pop-up text area: "Location " + old name + " renamed to " + new name + "."
      * Refresh the "Choose Location to Rename" dropdown to reflect the updated name
      * Do not clear the Pop-up text
      * Pop-up remains open
  * Pop-up text area to display messages to user


#### Delete Location

Open popup with:
  * Close button.
  * Title: Delete Location
  * Informational text at the top: "Only empty locations can be deleted. Move all the cards from one location to another before trying to delete a location."
  * Dropdown labeled "Choose Location to Delete"
    * Populated only with locations that have 0 cards — determined by checking that no rows exist in `collection_locations` for that `location_id`
    * Sorted alphabetically
    * Single-select
    * If no empty locations exist, the dropdown is empty and the Delete Location button is hidden
  * Button labeled "Delete Location" — only shown when a location is selected
    * On click, show an inline confirmation message: "Are you sure you want to delete this location?"
      * "Yes" button — proceeds with deletion
      * "No" button — cancels and returns to the dropdown without any changes
    * If Yes is selected:
      * Display message in Pop-up text area: "Deleting location..."
      * Delete the matching row from the `locations` table
      * When deleted, add a message in the Pop-up text area: "Location " + location name + " has been deleted."
      * Clear the dropdown selection and refresh the dropdown to remove the deleted location
      * Do not clear the Pop-up text
      * Pop-up remains open
  * Pop-up text area to display messages to user

### Updates

A text area at the bottom of the page displays operation progress. Messages append to the bottom; the user can scroll up to see previous messages.

#### Shared Message Format

Every operation logs three message types in sequence:
* **Start** — logged immediately when the button is clicked
* **Error** — logged if the operation fails: `"Error: " + error message`
* **Completion** — logged when the operation finishes (see each operation for the specific text)

#### Update Sets

* Button labeled "Update Card Set List"
* Source: https://api.scryfall.com/sets
* Updates the `sets` table; inserts any sets not already present
* Messages:
  * Start: `"Starting card set list update..."`
  * Completion: `"Done. " + total + " total set(s). " + added + " new set(s) added."` (singular/plural for each count)

#### Update Values

* Button labeled "Update Card Prices"
* Uses Scryfall bulk data to avoid excessive API requests — see https://scryfall.com/docs/api/bulk-data/
* Messages:
  * Start: `"Starting card price update (this will take a while)..."`
  * Completion: `"Done. Updated prices for " + n + " card."` (singular) or `"cards."` (plural)


---------------------------
## Current issues

### ~~TODO 1 — PriceService: Batch price updates~~ DONE

Replace the per-card `jdbc.update()` loop in `PriceService` with `jdbc.batchUpdate()` so all price rows are sent in a single round-trip instead of one per card.

| Where | What | Effort | Benefit |
| :---- | :---- | :---- | :---- |
| PriceService | Replace individual `jdbc.update()` with `jdbc.batchUpdate()` | Low | Dramatic reduction in DB round-trips during bulk price sync |

---

### ~~TODO 2 — SetService: Track inserts by return value~~ DONE

Replace the COUNT-before / COUNT-after pattern in `SetService` with checking the return value of `jdbc.update()` (returns 1 on insert, 0 on `INSERT IGNORE` skip) to count new sets without extra queries.

| Where | What | Effort | Benefit |
| :---- | :---- | :---- | :---- |
| SetService | Track inserts by `jdbc.update()` return value instead of COUNT before/after | Low | Removes 2 COUNT queries per sync; more accurate |

---

### ~~TODO 3 — CollectionService: Eliminate SELECT after upsert~~ DONE

After the `INSERT … ON DUPLICATE KEY UPDATE` in `CollectionService.addCard()`, remove the follow-up `SELECT collection_id` and instead use `LAST_INSERT_ID()` (returned by the JDBC update) to get the new row's ID without an extra round-trip.

| Where | What | Effort | Benefit |
| :---- | :---- | :---- | :---- |
| CollectionService | Use `LAST_INSERT_ID()` instead of SELECT after upsert | Low | One fewer DB round-trip per card add |

---

### ~~TODO 4 — LocationService: Extract shared validation method~~ DONE

`createLocation` and `renameLocation` both contain identical name-uniqueness check logic. Extract it into a private `validateUniqueName(String name, Integer excludeId)` method.

| Where | What | Effort | Benefit |
| :---- | :---- | :---- | :---- |
| LocationService | Extract shared `validateUniqueName()` helper | Low | Eliminates copy-paste; single maintenance point for uniqueness rule |

---

### ~~TODO 5 — PriceService: Inject ObjectMapper as Spring bean~~ DONE

`PriceService` creates a `new ObjectMapper()` manually, bypassing any app-wide Jackson configuration. Inject the `ObjectMapper` bean via constructor instead.

| Where | What | Effort | Benefit |
| :---- | :---- | :---- | :---- |
| PriceService | Inject `ObjectMapper` as Spring bean instead of manual `new ObjectMapper()` | Low | Picks up app-wide Jackson config (date formats, modules, etc.) automatically |

---

### ~~TODO 6 — CollectionRepository: Replace correlated subqueries with separate queries + merge~~ DONE

The `findAll()` query in `CollectionRepository` uses correlated subqueries (one per row) to aggregate location data. Replace with two flat queries — one for collection rows, one for location rows — and merge them in Java. Scales significantly better with large collections.

| Where | What | Effort | Benefit |
| :---- | :---- | :---- | :---- |
| CollectionRepository | Replace correlated subqueries with two flat queries merged in Java | High | Scales better with large collections; eliminates N correlated lookups |

