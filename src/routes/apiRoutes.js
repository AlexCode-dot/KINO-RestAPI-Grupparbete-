import express from 'express'
import { getTopRatedMoviesByRating } from '../services/moviesTopRated.js'
import cmsAdapter from '../services/fetchReviews.js'
import { getScreeningsForNextFiveDays, getAllScreeningsForOneMovie } from '../services/screeningsService.js'
import { calculateAverageRating } from '../services/calculateRatings.js'
import screeningAdapter from '../services/fetchScreenings.js'
import { getTitle } from '../services/fetchOmdb.js'
import { getExtraReviews } from '../services/fetchOmdb.js'

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

  //Route not finished. At this stage it is just for testing with one specific id
  router.get('/movies/screenings', async (request, response, next) => {
    try {
      const id = request.query.movieId
      const allScreenings = await getAllScreeningsForOneMovie(screeningAdapter, id)
      response.json(allScreenings)
    } catch (err) {
      next(err)
    }
  })

  router.get('/movies/:movieId/rating', async (request, response, next) => {
    try {
      const movieId = request.params.movieId
      const averageRating = await calculateAverageRating(movieId, cmsAdapter, getTitle, getExtraReviews)
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

  // Backend Router to get reviews based on a specific movie ID
  router.get('/movies/:id/reviews', async (req, res, next) => {
    const { id } = req.params
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5

    if (!id) {
      return res.status(400).json({ error: 'Movie ID saknas i URL:en' })
    }

    try {
      const { data, meta } = (await cmsAdapter.loadReviewsForMovie(id, page, pageSize)) || {
        data: [],
        meta: { pagination: { page, pageCount: 0 } },
      }

      res.json({
        reviews: data,
        meta: meta,
      })
    } catch (error) {
      console.error(`Fel vid hämtning av recensioner för film ${id}:`, error)
      next(error)
    }
  })

  return router
}
