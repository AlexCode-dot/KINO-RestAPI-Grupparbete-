import { getTitle, getExtraReviews } from './fetchOmdb.js'
import cmsAdapter from './fetchReviews.js'

export async function calculateAverageRating(movieId) {
  const reviews = await cmsAdapter.loadReviewsForMovie(movieId, 1, 100)
  //
  let ratings = reviews.data.map((review) => review.rating)
  console.log('Reviews ', ratings.length)

  const totalRatings = ratings.reduce((acc, rating) => acc + rating, 0)
  let averageRating = ratings.length ? totalRatings / ratings.length : 0

  const title = await getTitle(movieId)

  if (ratings.length < 5 && title) {
    console.log(`Not enough reviews for movie ${title} number of reviews found `, ratings.length)
    const omdb = await getExtraReviews(movieId)
    let newNumber = omdb / 2
    console.log(omdb, ' Divided with 2 ', newNumber)
    averageRating = newNumber
  }

  const debug = true
  if (debug) {
    // console.log("This is the review section ", reviews);
    console.log(`Reviews: ${ratings}`)
    console.log(`Average rating for movie nr ${movieId} ${title} ${averageRating.toFixed(1)}`)
    console.log('Average number is', averageRating.toFixed(1))
  }

  return averageRating
}
