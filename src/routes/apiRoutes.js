import express from 'express'
import { getTopRatedMoviesByRating } from '../services/moviesTopRated.js'
import cmsAdapter from '../services/fetchReviews.js'
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

// Recieve review from client
const reviews = {}
router.post('/movies/:id/reviews', (req, res) => {
  console.log(req.body)
  const movieID = req.params.id

  const comment = req.body.comment
  const rating = req.body.rating
  const author = req.body.author

  if (!comment || !rating || !author) {
    return res.status(400).json({ message: 'Alla fält måste fyllas i.' })
  }

  const userReview = {
    comment,
    rating: parseInt(rating),
    author,
  }

  console.log(userReview)

  if (!reviews[movieID]) {
    reviews[movieID] = [] //Skapar en tom array om det inte finns någon
  }

  res.status(200).json({ message: 'Recensionen är tillagd', review: userReview })

  reviews[movieID].push(userReview)
})
