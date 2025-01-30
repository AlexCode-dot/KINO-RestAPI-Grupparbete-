import { loadMovie, loadMovies } from './services/fetchMovies.js'
import initApp from './app.js'
import express from 'express'
import router from './services/fetchReviews.js'

const api = {
  loadMovie,
  loadMovies,
}

const app = initApp(api)
app.use('/api/reviews', router) // Route för recensioner

app.listen(5080, () => {
  console.log('Server running on http://localhost:5080')
})

/*
Startfil för applikationen/servern.
Den initierar och startar express-webbservern.

loadMovie och loadMovies importeras från fetchMovies.js. 
Dessa funktioner används för att hämta filmer från API:et.

initApp importeras från app.js och är funktionen 
som skapar och konfigurerar Express-applikationen.

const api = {
  loadMovie,
  loadMovies,
} = Ett API-objekt skapas där både loadMovie och loadMovies 
 placeras. Detta gör att dessa funktioner kan användas 
 i Express-routs när applikationen startar.

 INITIERING OCH START=
const app = initApp(api)
app.listen(5080)

tillgänglig på: http://localhost:5080
*/
