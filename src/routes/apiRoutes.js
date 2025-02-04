import express from 'express'
import { getTopRatedMoviesByRating } from '../services/moviesTopRated.js'
import cmsAdapter from '../services/fetchReviews.js'
import { calculateAverageRating } from '../services/calculateRatings.js'
import { getScreeningsForNextFiveDays } from '../services/screeningsService.js'
import screeningAdapter from '../services/fetchScreenings.js'

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
}

router.get('/average-rating/:movieId', async (req, res) => {
  try {
    console.log('Calculating average rating')
    const movieId = req.params.movieId
    const averageRating = await calculateAverageRating(movieId)
    res.json({ averageRating })
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate average rating' })
  }
  /*
  router.get('/movies/screenings', async (request, response, next) => {
    try {
      const screenings = await getScreeningsForMovies(screeningAdapter, [])
      response.json(screenings)
    } catch (err) {
      next(err)
    }
  })
*/
  router.get('/movies/screenings/next-five-days', async (request, response, next) => {
    try {
      const screenings = await getScreeningsForNextFiveDays(screeningAdapter)
      response.json(screenings)
    } catch (err) {
      next(err)
    }
  })

  return router
})
