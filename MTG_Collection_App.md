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
| location\_id | INT | Location ID | Foreign key to identify location |
| location\_key | VARCHAR(80) | Location Key | Human-readable slug (e.g. storage\_box\_1) |
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
* Mapping \<TBD\>

### Images

* The default image for the back of a card is located at mtg2/frontend/src/images/card-back.jpg  
* Double sided cards are the exception and will have a unique front and back

## Home Page

* Above table, buttons with options for each subheader in this section  
  * Default to “**Browse My Collection**”  
* Information shown below buttons  
  * Total card count  
  * Total value of cards  
  * Total Cards shown (after filters applied)  
  * Total value of cards shown (after filters applied)  
* Table with entire collection  
  * Paginated to show *n* rows  
    * Value for *n* can be chosen from a dropdown  
    * Values for *n* can be 50, 100, 150, 200, 500   
* Columns visible by default:  
  * Name  
    * DB cards.name  
  * Quantity  
    * DB collection.quantity  
  * Color  
    * DB card\_colors.color  
  * Type  
    * DB cards.type\_line  
  * Card Set  
    * DB cards set\_id  
  * Collector Number  
    * DB cards.collector\_number  
  * Foil  
    * DB cards.foil  
  * Storage Location  
    * DB locations.name  
  * Value  
    * If not foil (default): DB card\_prices.usd  
    * If foil: DB card\_prices.usd\_foil  
  * Last Updated Date  
    * DB card\_prices.updated\_at  
* 

### Browse My Collection

* Filters at the top of the table to filter collection by  
  * Name  
    * Input box  
  * Mana color(s)  
    * Checkboxes  
      * {R}, {G}, {W}, {U}, {B}  
  * Card set  
    * Multi-select dropdown using DB sets.name  
  * Storage Location  
    * Multi-select dropdown using DB locations.name  
* Sort by any of the visible columns  
* Click on “Name” to show a pop-up  
  * Name of the card at the top  
  * Small card image (front and back)  
    * DB: card\_images ?  
    * Single sided cards only need to show the front  
    * Double sided cards should show front and back side-by-side
      * Clicking front should show the large image of the front side and small image of back side and vise versa.
    * Clicking image toggles between small and large formats of image  
  * Below image(s) should show card details.  Double sided cards should show the data for the selected side of the card. 
    * Rarity  
      * DB cards.rarity  
    * Mana cost  
      * DB cards.mana\_cost  
    * Type(s)  
      * DB cards.type\_line  
    * Oracle Text  
      * DB cards.oracle\_text  
    * Flavor Text  
      * DB cards.flavor\_text  
    * Power (if not null)  
      * DB cards.power  
    * Toughness (if not null)  
      * DB cards.toughness

### Browse MTG database

### Edit collections

### Updates

## Edit Collections

### Add New Card

### Add New Collection

### Move Card to Collection

### Rename Collection

### Delete Collection

### Delete Card

## Updates

### Update Sets

### Update Values

—--------------------------

**Card Finder (Scryfall Search)**

* Search by name, collector number, set, and language  
* View full card details from search results  
* Select foil / non-foil  
* Select target location  
* Enter quantity and add card to collection

**Card Movement**

* Move cards between locations  
* Select source and destination location  
* Specify quantity to move  
* Validation (e.g. prevent moving to same location)

**Location Management**

* Create new storage location  
* Create new deck location  
* Select location type (Storage or Deck)

**Pricing**

* View regular and foil prices per card  
* View total value (quantity × price) for filtered results

Filtering out the ones containing digits ({2W}, {2U}, etc.), here's the full list:

**Basic Colors**

{W} {U} {B} {R} {G} {C}

**Special**

{T} {Q} {E} {S} {P} {X} {Y} {Z} {PW} {CHAOS} {A} {HALF} {INFINITY} {HR} {HW}

**Hybrid (slash format)**

{W/U} {W/B} {U/B} {U/R} {B/R} {B/G} {R/G} {R/W} {G/W} {G/U}

**Hybrid (no slash — alternate format)**

{WU} {WB} {UB} {UR} {BR} {BG} {RG} {RW} {GW} {GU}

**Phyrexian (slash format)**

{W/P} {U/P} {B/P} {R/P} {G/P}

**Phyrexian (no slash — alternate format)**

{WP} {UP} {BP} {RP} {GP}

The slash and no-slash variants appear to be two encodings of the same symbols — the slash format ({W/U}) is the standard Scryfall notation, and the no-slash versions ({WU}) are likely a legacy or alternate mapping in the old app.

