import express from 'express'
import { getTopRatedMoviesByRating } from '../services/moviesTopRated.js'
import cmsAdapter from '../services/fetchReviews.js'
import { getAllReviewsForMovie } from '../services/reviewsService.js'

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

  //Hämta filmreviews

  router.get('/reviews/movie/:id', async (req, res, next) => {
    try {
      const movieId = req.params.id
      const reviews = await getAllReviewsForMovie(movieId) // Hämtar recensioner för varej film id

      if (!reviews.length) {
        return res.status(404).json({ message: 'Inga recensioner tillgängliga' })
      }

      res.json(reviews) // Returnerar alla recensioner som JSON obj
    } catch (err) {
      console.error('Error fetching reviews:', err)
      res.status(500).json({ error: 'Misslyckades att hämta recensioner' })
    }
  })

  return router
}
