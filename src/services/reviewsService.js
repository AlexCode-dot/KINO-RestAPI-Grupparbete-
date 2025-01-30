import cmsAdapter from './fetchReviews.js'

export async function getAllReviewsForMovie(cmsAdapter, movieId) {
  const reviews = []
  let currentPage = 1

  const firstPage = await cmsAdapter.loadReviewsForMovie(movieId, currentPage)
  reviews.push(...firstPage.data)

  const totalPages = firstPage.meta.pagination.pageCount

  while (currentPage < totalPages) {
    currentPage++
    const reviewsPage = await cmsAdapter.loadReviewsForMovie(movieId, currentPage)
    reviews.push(...reviewsPage.data)
  }

  return reviews
}

export function filterRecentReviews(reviews) {
  const now = new Date()
  return reviews.filter((review) => {
    const reviewDate = new Date(review.createdAt)
    const daysDifference = Math.floor((now - reviewDate) / (1000 * 60 * 60 * 24))
    return daysDifference <= 30
  })
}

export function calculateAverageRating(reviews) {
  if (reviews.length === 0) return 0
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const average = totalRating / reviews.length
  return parseFloat(average.toFixed(1))
}
