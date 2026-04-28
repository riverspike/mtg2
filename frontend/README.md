# MTG Cards Frontend

React 19 single-page application for browsing the MTG card collection. Uses Redux Toolkit for state management and Vite as the build tool.

---

## Prerequisites

### 1. Node.js 22+
The project requires Node.js 22 or higher (Node 24 LTS used in this project).

- Install via winget: `winget install OpenJS.NodeJS.LTS`
- Or download: https://nodejs.org/en/download/
- Verify: `node --version`

### 2. npm 10+
Comes bundled with Node.js. Verify: `npm --version`

### 3. Backend running
The frontend proxies all `/api/*` requests to the Spring Boot backend on `localhost:8080`.
The backend must be running before using the app.

Start the full stack (database + backend) with one command:
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
npm run build
```

Output goes to `dist/`. Serve with:

```bash
npm run preview
```

---

## Usage

1. Start the full stack: `cd mtg2 && docker compose up -d`
2. Start the frontend: `cd mtg2/frontend && npm run dev`
3. Open http://localhost:5173
4. Click **Load All** to fetch and display the full card collection

---

## Features

- **Load All** button fetches all cards from the backend API
- Loading state disables the button and shows "Loading…" while the request is in flight
- Table displays: card image(s), name, set, mana cost, type line, rarity, power/toughness, foil status, quantity
- Double-sided cards show both the front and back face images in the Image column
- Rows are colour-coded by rarity (mythic = orange, rare = gold, uncommon = silver, common = grey)

---

## Project Structure

```
frontend/
├── package.json               Dependencies and scripts
├── vite.config.js             Vite config + /api proxy to :8080
├── index.html                 HTML entry point
└── src/
    ├── main.jsx               App entry — mounts Redux Provider
    ├── App.jsx                Root component — Load All button + table
    ├── index.css              Global styles
    ├── store/
    │   ├── index.js           Redux store (configureStore)
    │   └── collectionSlice.js fetchCollection thunk + collection state
    └── components/
        └── CollectionTable.jsx  Card data table
```

---

## Tech Stack

| Layer         | Technology       | Version |
|---------------|------------------|---------|
| Language      | JavaScript (JSX) | ES2022+ |
| UI Framework  | React            | 19      |
| State         | Redux Toolkit    | 2.3     |
| React-Redux   | react-redux      | 9.1     |
| Build Tool    | Vite             | 6       |
| Node Runtime  | Node.js          | 24 LTS  |

---

## API Dependency

| Endpoint             | Method | Description                     |
|----------------------|--------|---------------------------------|
| `/api/collection`    | GET    | Returns all cards in collection |
