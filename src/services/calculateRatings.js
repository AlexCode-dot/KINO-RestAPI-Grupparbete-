import { getTitle, getExtraReviews } from './fetchOmdb.js'
import cmsAdapter from './fetchReviews.js'

async function fetchAllReviews(movieId, cmsAdapter) {
  let allReviews = []
  let page = 1
  const pageSize = 5
  let hasMoreReviews = true

  while (hasMoreReviews) {
    console.log('Fetching reviews for movie:', movieId, 'page:', page)
    const reviews = await cmsAdapter.loadReviewsForMovie(movieId, page, pageSize)
    if (reviews.data.length > 0) {
      allReviews = allReviews.concat(reviews.data)
      page++
    } else {
      hasMoreReviews = false
    }
  }

  return allReviews
}

export async function calculateAverageRating(movieId, cmsAdapter, getTitle, getExtraReviews) {
  const reviews = await fetchAllReviews(movieId, cmsAdapter)

  let ratings = reviews.map((review) => review.rating)
  console.log('Initial ratings:', ratings)

  const totalRatings = ratings.reduce((acc, rating) => acc + rating, 0)
  let averageRating = ratings.length ? totalRatings / ratings.length : 0

  const title = await getTitle(movieId)

  if (ratings.length < 5 && title) {
    // console.log(`Not enough reviews for movie ${title} number of reviews found `, ratings.length)
    console.log(`Not enough reviews for movie`, title)
    console.log(`Number of reviews found`, ratings.length)
    const omdb = await getExtraReviews(movieId)
    let newNumber = omdb / 2
    console.log(omdb, ' Divided with 2 ', newNumber)
    averageRating = newNumber
  }

  const debug = false
  if (debug) {
    console.log('This is the review section ', reviews)
    console.log(`Reviews: ${ratings}`)
    console.log(`Average rating for movie nr ${movieId} ${title} ${averageRating}`)
    console.log('Average number is', averageRating.toFixed(1))
  }

  return averageRating
}
