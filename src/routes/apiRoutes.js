import express from 'express'
import { getTopRatedMoviesByRating } from '../services/moviesTopRated.js'
import cmsAdapter from '../services/fetchReviews.js'
import { getScreeningsForNextFiveDays, getAllScreeningsForOneMovie } from '../services/screeningsService.js'
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

  //Route not finished. At this stage it is just for testing with one specific id
  router.get('/test', async (request, response, next) => {
    try {
      const allScreenings = await getAllScreeningsForOneMovie(screeningAdapter, 8)
      response.json(allScreenings)
    } catch (err) {
      next(err)
    }
  })

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
}
