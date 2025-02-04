import cmsAdapter from './fetchReviews.js'

export async function calculateAverageRating(movieId) {
  const reviews = await cmsAdapter.loadReviewsForMovie(movieId, 1, 100)
  const ratings = reviews.data.map((review) => review.rating)
  const totalRatings = ratings.reduce((acc, rating) => acc + rating, 0)
  const averageRating = ratings.length ? totalRatings / ratings.length : 0
  const debug = true
  if (debug === false) {
    console.log(`Reviews: ${ratings}`)
    console.log(`Average rating for movie ${movieId}: ${averageRating}`)
  }

  return averageRating
}
