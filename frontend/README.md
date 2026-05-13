# MTG Cards Frontend

React 19 single-page application for the MTG card collection. Uses Redux Toolkit for state management, Vite 6 as the build tool, and TypeScript throughout.

---

## Prerequisites

### 1. Node.js 22+
- Install via winget: `winget install OpenJS.NodeJS.LTS`
- Or download: https://nodejs.org/en/download/
- Verify: `node --version`

### 2. npm 10+
Comes bundled with Node.js. Verify: `npm --version`

### 3. Backend running
The frontend proxies all `/api/*` requests to the Spring Boot backend on `localhost:8080`.

Start the full stack (database + backend):
```bash
cd mtg2
docker compose up -d
```

Or see `../backend/README.md` for local development options.

---

## Install Dependencies

```bash
cd mtg2/frontend
npm install
```

---

## Run (Development)

```bash
npm run dev
```

The app starts on **http://localhost:5173**.

All `/api/*` requests are automatically proxied to `http://localhost:8080` — no CORS configuration needed during development.

---

## Build (Production)

```bash
npm run build       # outputs to dist/
npm run preview     # serve the production build locally
```

---

## Type Checking

```bash
npx tsc --noEmit
```

---

## Usage

1. Start the full stack: `cd mtg2 && docker compose up -d`
2. Start the frontend: `cd mtg2/frontend && npm run dev`
3. Open http://localhost:5173
4. The collection loads automatically on the **Browse My Collection** tab

---

## Features

### Browse My Collection
- Stats bar: total card count, total value, filtered count, filtered value
- Filters: name (text), color (mana icon checkboxes), card set (multi-select), storage location (multi-select)
- Sortable, paginated table (50 / 100 / 150 / 200 / 500 rows per page)
- Mana cost column renders SVG mana icons from `src/images/mana/`
- Rows colour-coded by rarity (mythic, rare, uncommon, common)
- Click a card name to open a detail popup with card image, oracle text, and flavor text
- Double-sided cards show both face images; clicking a face enlarges it and shows that face's details

### Updates
- **Update Card Set List** button fetches the full set list from Scryfall and upserts it into the database; shows count of new vs. updated sets
- **Update Card Prices** button fetches current `usd` and `usd_foil` prices from Scryfall for every card in the database, one card per 100 ms; note warns this will take time
- Both buttons disable while running and display success or error feedback

### Search MTG Database
- Filters: name, color, card set (multi-select, populated from all sets in the database)
- **Search Scryfall** button sends a query to the Scryfall API and populates the table
- Button is disabled until at least one filter is set
- Results show the same table columns and support the same card detail popup
- Respects Scryfall rate limit (100 ms between paginated requests)
- Card detail popup includes an **Add to Collection** form:
  - Location dropdown (all storage locations from `GET /api/locations`)
  - Quantity number input (min 1)
  - Foil checkbox
  - **Add to Collection** button — posts to `POST /api/collection`, upserts the card and increments quantity

---

## Project Structure

```
frontend/
├── package.json
├── tsconfig.json              TypeScript config
├── tsconfig.node.json         TypeScript config for vite.config.ts
├── vite.config.ts             Vite config + /api proxy to :8080
├── index.html                 HTML entry point → src/main.tsx
└── src/
    ├── vite-env.d.ts          Vite client type reference
    ├── main.tsx               App entry — mounts Redux Provider
    ├── App.tsx                Root — tab nav + view routing
    ├── index.css              Global styles (dark MTG theme)
    ├── types/
    │   └── card.ts            CollectionCard, CardFace, CardFiltersState, LocationOption interfaces
    ├── store/
    │   ├── index.ts           Redux store — exports RootState, AppDispatch
    │   ├── collectionSlice.ts fetchCollection thunk + collection state
    │   └── hooks.ts           useAppDispatch, useAppSelector typed hooks
    ├── utils/
    │   ├── manaSymbols.ts     Symbol → SVG URL mapping (all mana symbols)
    │   ├── scryfallApi.ts     Scryfall search — query builder, API call, response mapper
    │   ├── collectionApi.ts   addCardToCollection — POST /api/collection
    │   ├── setsApi.ts         fetchAllSets — GET /api/sets
    │   └── updatesApi.ts      updateCardSetList — POST /api/sets/update
    ├── components/
    │   ├── CardFilters.tsx    Shared filter bar (name, color, optional sets/locations)
    │   ├── CollectionTable.tsx Sortable paginated card table
    │   ├── CardDetailModal.tsx Card detail popup + Add to Collection form (Search tab)
    │   └── ManaText.tsx       Renders {TOKEN} mana cost strings as icon images
    ├── views/
    │   ├── BrowseCollection.tsx  Browse My Collection tab
    │   ├── SearchMtgDatabase.tsx Search MTG Database tab
    │   └── Updates.tsx           Updates tab (Update Card Set List)
    └── images/
        ├── card-back.jpg
        └── mana/              SVG mana symbol icons
```

---

## Tech Stack

| Layer        | Technology       | Version |
|--------------|------------------|---------|
| Language     | TypeScript       | 5.x     |
| UI Framework | React            | 19      |
| State        | Redux Toolkit    | 2.3     |
| React-Redux  | react-redux      | 9.1     |
| Build Tool   | Vite             | 6       |
| Node Runtime | Node.js          | 24 LTS  |

---

## API Dependencies

| Endpoint          | Method | Description                              |
|-------------------|--------|------------------------------------------|
| `/api/collection` | GET    | Returns all cards in the collection      |
| `/api/collection` | POST   | Adds a card (upserts card + increments quantity) |
| `/api/locations`  | GET    | Returns all storage locations and decks  |
| `/api/sets`        | GET   | Returns all sets from the database (code + name)         |
| `/api/prices/update` | POST | Fetches current card prices from Scryfall (100 ms/card)  |
| `/api/sets/update` | POST  | Fetches sets from Scryfall and upserts into the database |

### External APIs

| Service  | Endpoint                          | Description                      |
|----------|-----------------------------------|----------------------------------|
| Scryfall | `GET /cards/search?q=...`         | Card search (Search tab)         |
| Scryfall | Rate limit: 10 req/s              | See https://scryfall.com/docs/api |
