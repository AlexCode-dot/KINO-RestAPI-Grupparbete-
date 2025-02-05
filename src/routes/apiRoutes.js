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

  router.get('/movies/:movieId/rating', async (request, response, next) => {
    try {
      const movieId = request.params.movieId
      const averageRating = await calculateAverageRating(movieId)
      response.json({ averageRating })
    } catch (err) {
      next(err)
    }
  })

  router.get('/movies/screenings/next-five-days', async (request, response, next) => {
    try {
      const screenings = await getScreeningsForNextFiveDays(screeningAdapter)
      response.json(screenings)
    } catch (err) {
      next(err)
    }
  })

  //Detta är backend-routern.
  //Hämtar filmreviews, express route för hantering av GET begäran efter paginerade recensioner, för EN specifik film med unikt Id.
  router.get('/movies/reviews/:movieId', async (req, res, next) => {
    const { movieId } = req.params
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5

    if (!movieId) {
      return res.status(400).json({ error: 'Movie ID saknas i URL:en' })
    }

    try {
      const { data, meta } = (await cmsAdapter.loadReviewsForMovie(movieId, page, pageSize)) || {
        data: [],
        meta: { pagination: { page, pageCount: 0 } },
      }

      res.json({
        reviews: data,
        meta: meta,
      })
    } catch (error) {
      console.error(`Fel vid hämtning av recensioner för film ${movieId}:`, error)
      next(error)
    }
  })

  return router
}
