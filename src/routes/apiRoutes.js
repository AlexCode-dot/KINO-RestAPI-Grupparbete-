import express from 'express'
import { getTopRatedMoviesByRating } from '../services/moviesTopRated.js'
import cmsAdapter from '../services/fetchReviews.js'
import { getScreeningsForMovies } from '../services/screeningsService.js'
import screeningAdapter from '../services/fetchScreenings.js'
import renderPage from '../lib/renderPage.js'

const router = express.Router()

export default function apiRoutes(api) {
  router.get('/movies/top-rated', async (request, response, next) => {
    try {
      const topRated = await getTopRatedMoviesByRating(cmsAdapter, api.loadMovies)
      response.json(topRated)
    } catch (err) {
      next(err)
    }
  })

  router.get('/movies/screenings', async (request, response, next) => {
    try {
      const screenings = await getScreeningsForMovies(screeningAdapter, [])
      response.json(screenings)
    } catch (err) {
      next(err)
    }
  })

  return router
}
