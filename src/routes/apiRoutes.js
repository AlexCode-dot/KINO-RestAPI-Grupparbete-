import express from 'express'
import { getTopRatedMoviesByRating } from '../services/moviesTopRated.js'
import cmsAdapter from '../services/fetchReviews.js'

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

  //Hämta senaste recensionerna
  router.get('/reviews/latest', async (request, response, next) => {
    try {
      const latestReviews = await cmsAdapter.loadReviewsForMovie(null, 1, 5)
      response.json(latestReviews.data)
    } catch (err) {
      next(err)
    }
  })

  return router
}
