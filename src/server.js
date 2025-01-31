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
