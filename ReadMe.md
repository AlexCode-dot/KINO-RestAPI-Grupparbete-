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
```

### 2. Hämta recensioner för en film

**Endpoint:** `GET /api/movies/:id/reviews`

**Beskrivning:** Hämtar recensioner för en specifik film.

#### Query-parametrar

| Parameter  | Typ    | Beskrivning                |
| ---------- | ------ | -------------------------- |
| `page`     | Number | Sidnummer för paginering   |
| `pageSize` | Number | Antal recensioner per sida |

**Exempel på request:**

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
```

### 3. Skicka en recension för en film

**Endpoint:** `POST /api/movies/:id/reviews`

**Beskrivning:** Skickar en recension för en specifik film.

#### Request Body

| Parameter | Typ    | Beskrivning              |
| --------- | ------ | ------------------------ |
| `rating`  | Number | Betyget för filmen (1-5) |
| `comment` | String | Kommentar om filmen      |
| `author`  | String | Namn                     |

**Exempel på request:**

POST /api/movies/3/reviews
Content-Type: application/json

```json
{
  "rating": 5,
  "comment": "string",
  "author": "string"
}
```

**Exempel på respons (201 Created)**

```json
{
  "message": "Review submitted successfully"
}
```

### 4. Hämta betyg för en film

**Endpoint:** `GET /api/movies/:movieId/rating`

**Beskrivning:** Hämtar genomsnittsbetyg för en film.

**Exempel på request:**

GET /api/movies/3/rating

**Exempel på respons (200 OK)**

```json
{
  "average_rating": 4.8
}
```

**Logik**

#### FetchAverageRating

```json
async function fetchAverageRating(movieId) {
  const response = await fetch(`/api/movies/${movieId}/rating`)
  const data = await response.json()
  return data.averageRating
}
```

- När filmsidan laddas kör en javascript fil fetchAverageRating.js som ber backend om ett genomsnittsbetyg från recensioner.
- Javascript filen gör en GET (fetch) som skickas via apiRoutes.js till app.js.

#### FetchAllReviews

```json
async function fetchAllReviews(movieId, cmsAdapter) {
  let allReviews = []
  let page = 1
  const pageSize = 5
  let hasMoreReviews = true

  while (hasMoreReviews) {
    console.log('Fetching reviews for movie:', movieId, 'page:', page)
    const reviews = await cmsAdapter.loadReviewsForMovie(movieId, page, pageSize)
    if (reviews.data.length > 0) {
      allReviews = allReviews.concat(reviews.data)
      page++
    } else {
      hasMoreReviews = false
    }
  }
  return allReviews
}
```

- Functionen fetchAllReviews som ligger i fetchOmdb.js hämtar alla reviews via parametrar movieId (som ger information vilken film det handlar om) och cmsAdapter (som hämtar reviews från loadReviews.js) och skickar vidare de till calculateAverageRating i calculateRatings.js.

#### ApiRoutes

```json
export default function apiRoutes(api) {
  router.get('/movies/top-rated', async (request, response, next) => {

  router.get('/movies/:movieId/rating', async (request, response, next) => {
    try {
      const movieId = request.params.movieId
      const averageRating = await calculateAverageRating(movieId, cmsAdapter, getTitle, getExtraReviews)
      response.json({ averageRating })
    } catch (err) {
      next(err)
    }
  })
  return router
}
```

- Routen i apiRoutes.js kör calculateAverageRating och skickar med de parametrar som behövs, movieId, cmsAdapter, getTitle, getExtraReviews.)

#### CalculateAverageRating

```json
export async function calculateAverageRating(movieId, cmsAdapter, getTitle, getExtraReviews) {
  const reviews = await fetchAllReviews(movieId, cmsAdapter)

  let ratings = reviews.map((review) => review.rating)
  console.log('Initial ratings:', ratings)

  const totalRatings = ratings.reduce((acc, rating) => acc + rating, 0)
  let averageRating = ratings.length ? totalRatings / ratings.length : 0

  const title = await getTitle(movieId)

  if (ratings.length < 5 && title) {
    // console.log(`Not enough reviews for movie ${title} number of reviews found `, ratings.length)
    console.log(`Not enough reviews for movie`, title)
    console.log(`Number of reviews found`, ratings.length)
    const omdb = await getExtraReviews(movieId)
    let newNumber = omdb / 2
    console.log(omdb, ' Divided with 2 ', newNumber)
    averageRating = newNumber
  }
  const debug = false
  if (debug) {
    console.log('This is the review section ', reviews)
    console.log(`Reviews: ${ratings}`)
    console.log(`Average rating for movie nr ${movieId} ${title} ${averageRating}`)
    console.log('Average number is', averageRating.toFixed(1))
  }
  return averageRating
}
```

**Om filmen har minst 5 recensioner, räknas snittet ut från dessa.**

- Functionen calculateRatings kollar igenom recensioner och räknar ut genomsnittsbetyget.
- functionen calculateRatings kör en function som heter getTitle för att få en titel.
- Genomsnittsbetyget skickas till webbläsaren.

**Om färre än 5 recensioner finns, hämtas snittet från OMDb API.**

- Om det finns mindre än 5 recensioner och att det finns en titel körs en if-sats som meddelar att det inte finns tillräckligt med recensioner och kör en funktion som heter getExtraReviews.
- Det nya genomsnittsbetyget som kommer tillbaka från getExtraReviews delas med 2 för att stämma med sidans 1-5 ratings istället för IMDb som har 1-10.
- Det nya betyget skickas sedan från calculateRatings till webbläsaren

#### GetTitle

```json
export async function getTitle(movieId) {
  const movieurl = `https://plankton-app-xhkom.ondigitalocean.app/api/movies/${movieId}`
  console.log('Fetching movie with ID:', movieId)
  console.log(movieurl)
  const response = await fetch(movieurl)
  const data = await response.json()

  if (!response.ok) {
    console.error(`Error fetching data from API: ${data.message}`)
    // return null
  }

  const title = data.data.attributes.title
  console.log(`stored title: ${title}`)

  return title
}
```

- Funktionen getTitle som hämtas från fetchOmdb.js tar en parameter movieId och kör en fetch mot planktonapi med movieId som en parameter för att hämta filmens titel.

#### GetExtraReviews

```json
export async function getExtraReviews(movieId) {
  const movieurl = `https://plankton-app-xhkom.ondigitalocean.app/api/movies/${movieId}`
  console.log('Fetching movie with ID:', movieId)
  console.log(movieurl)

  const response = await fetch(movieurl)
  const data = await response.json()
  const debug = false
  if (!response.ok) {
    console.error(`Error fetching data from API: ${data.message}`)
  }
  const imdb = data.data.attributes.imdbId

  if (debug === true) {
    console.log('Fetched movies data:', data)
    console.log('getting imdb id:', data.data.attributes.imdbId)
    console.log(`stored imdb: ${imdb}`)
  }
  const apiKey = 'apikey=a159d0a'
  const externalApiUrl = `https://www.omdbapi.com/?${apiKey}&i=${imdb}`
  const externalApiResponse = await fetch(externalApiUrl)
  const omdb = await externalApiResponse.json()

  const extraReview = omdb.imdbRating
  const InternetMovieDatabase = omdb.Ratings[0]
  const Metacritic = omdb.Ratings[1]
  const Rottentomatos = omdb.Ratings[2]
  const Metascore = omdb.Metascore
  const runTime = omdb.Runtime

  if (debug === true) console.log('the response data', omdb)
  console.log(externalApiUrl)
  console.log('Runtime', runTime)
  console.log('Internet Movie Database', InternetMovieDatabase)
  console.log('Metacritic', Metacritic)
  console.log('Rotten Tomatoes', Rottentomatos)
  console.log('this is what omdb is sending', extraReview)
  return extraReview
}

export async function getTitle(movieId) {
  const movieurl = `https://plankton-app-xhkom.ondigitalocean.app/api/movies/${movieId}`
  console.log('Fetching movie with ID:', movieId)
  console.log(movieurl)
  const response = await fetch(movieurl)
  const data = await response.json()

  if (!response.ok) {
    console.error(`Error fetching data from API: ${data.message}`)
    // return null
  }

  const title = data.data.attributes.title
  console.log(`stored title: ${title}`)

  return title
}
```

- Funktionen getExtraReviews tar med en parameter movieId som körs mot planktonapi för att få tag i filmens imdb id, detta körs sedan mot ett externt api (OMDb api) som skickar in filmens id och hämtar betyget om den filmen som skickas in till calculateRatings.

#### DisplayAverageRating

```json
async function displayAverageRating(movieId, debug) {
  const averageRating = await fetchAverageRating(movieId)
  const ratingContainer = document.querySelector(`.singleMovie__main-rating`)
  ratingContainer.textContent = `Snittbetyg: ${averageRating.toFixed(1)}`
  if (debug === true) {
    console.log('fetchAverageRating loaded')
    console.log(ratingContainer.textContent)
  }
}
```

- Tar genomsnittsbetyget som den får tillbaka i webbläsaren och visar den för användaren.

### 5. Hämta de närmaste filmvisningarna

**Endpoint:** `GET /api//movies/screenings/next-five-days`

**Beskrivning:** Hämtar en lista över filmvisningar för följande 5 dagar, max 10 visningar.

**Exempel på request:**

GET /api//movies/screenings/next-five-days

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
```

**Logik**

- Backend filtrerar visningar så att endast de närmaste 5 dagarna inkluderas.
- Max 10 visningar returneras.

### 6. Hämta topp 5 filmer baserat på betyg

**Endpoint:** `GET /api/movies/top-rated`

**Beskrivning:** Hämtar de 5 bäst betygsatta filmerna under de senaste 30 dagarna.

**Exempel på request:**

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
```

**Logik**

- Backend filtrerar recensioner från de senaste 30 dagarna.
- Filmer som inte har några betyg exluderas helt från listan.
