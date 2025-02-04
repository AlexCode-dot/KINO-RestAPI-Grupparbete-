import cmsAdapter from './fetchReviews.js'

export async function calculateAverageRating(movieId) {
  const reviews = await cmsAdapter.loadReviewsForMovie(movieId, 1, 5)
  const ratings = reviews.data.map((review) => review.rating)
  const totalRatings = ratings.reduce((acc, rating) => acc + rating, 0)
  const averageRating = ratings.length ? totalRatings / ratings.length : 0
  console.log(`Reviews: ${JSON.stringify(ratings)}`)
  console.log(`Average rating for movie ${movieId}: ${averageRating}`)
  return averageRating
}
