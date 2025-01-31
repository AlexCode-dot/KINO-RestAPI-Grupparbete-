Sass kommando: npm run watch-css

# API-dokumentation för Kino-appen

## Översikt

Detta API fungerar som en mellanhand mellan frontend och ett externt CMS. Det hanterar filmer, recensioner och filmvisningar.

## Externa API:er

### CMS API

- **Används för att hämta filmer, recensioner och visningar.**

### IMDB API (RapidAPI/omdbapi)

- **Används för att hämta genomsnittsbetyg om färre än 5 recensioner finns.**

## Endpoints

### 1. Hämta kommande visningar för en film

**Endpoint:** `GET /api/movies/:id/screenings`

**Beskrivning:** Hämtar alla kommande visningar för en specifik film.

**Exempel på request:**

````http
GET /api/movies/3/screenings

**Exempel på respons (200 OK)**

```json
{
  "screenings": [
    {
      "id": 1,
      "start_time": "2025-02-01T18:00:00Z",
      "room": "string"
    }
  ]
}

### 2. Hämta recensioner för en film

**Endpoint:** `GET /api/movies/:id/reviews`

**Beskrivning:** Hämtar recensioner för en specifik film.

#### Query-parametrar

| Parameter  | Typ    | Beskrivning               |
|------------|--------|---------------------------|
| `page`     | Number | Sidnummer för paginering  |
| `pageSize` | Number | Antal recensioner per sida|

**Exempel på request:**

```http
GET /api/movies/3/reviews?page=1&pageSize=5

**Exempel på respons (200 OK)**

```json
{
  "reviews": [
    {
      "id": 1,
      "author": "string",
      "rating": 5,
      "comment": "string"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3
  }
}

### 3. Skicka en recension för en film

**Endpoint:** `POST /api/movies/:id/reviews`

**Beskrivning:** Skickar en recension för en specifik film.

#### Request Body

| Parameter  | Typ    | Beskrivning                  |
|------------|--------|------------------------------|
| `rating`   | Number | Betyget för filmen (1-5)     |
| `comment`  | String | Kommentar om filmen          |
| `author`   | String | Namn                         |

**Exempel på request:**

```http
POST /api/movies/3/reviews
Content-Type: application/json

```json
{
  "rating": 5,
  "comment": "string",
  "author": "string"
}

**Exempel på respons (201 Created)**

```json
{
  "message": "Review submitted successfully"
}


### 4. Hämta betyg för en film

**Endpoint:** `GET /api/movies/:id/rating`

**Beskrivning:** Hämtar genomsnittsbetyg för en film.

**Exempel på request:**

```http
GET /api/movies/3/rating

**Exempel på respons (200 OK)**

```json
{
  "average_rating": 4.8
}

**Logik**

- Om filmen har minst 5 recensioner, räknas snittet ut från dessa.
- Om färre än 5 recensioner finns, hämtas snittet från IMDB API.

### 5. Hämta de närmaste filmvisningarna

**Endpoint:** `GET /api/screenings/upcoming`

**Beskrivning:** Hämtar en lista över de 10 närmaste filmvisningarna.

**Exempel på request:**

```http
GET /api/screenings/upcoming

**Exempel på respons (200 OK)**

```json
{
  "screenings": [
    {
      "id": 1,
      "title": "string",
      "image": "url",
      "start_time": "2025-02-01T18:00:00Z",
      "room": "string"
    }
  ]
}

**Logik**

- Backend filtrerar visningar så att endast de närmaste 5 dagarna inkluderas.
- Max 10 visningar returneras.

### 6. Hämta topp 5 filmer baserat på betyg

**Endpoint:** `GET /api/movies/top-rated`

**Beskrivning:** Hämtar de 5 bäst betygsatta filmerna under de senaste 30 dagarna.

**Exempel på request:**

```http
GET /api/movies/top-rated

**Exempel på respons (200 OK)**

```json
{
  "movies": [
    {
      "id": 3,
      "title": "string",
      "image": "url",
      "average_rating": 4.8
    }
  ]
}

**Logik**

- Backend filtrerar recensioner från de senaste 30 dagarna.
- Filmer som inte har några betyg exluderas helt från listan.
````
