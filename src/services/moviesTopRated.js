import { filterRecentReviews, calculateAverageRating, getAllReviewsForMovie } from './reviewsService.js'

export async function getTopRatedMoviesByRating(cmsAdapter, loadMovies) {
  const movies = await loadMovies()

  const reviewPromises = movies.map((movie) => getAllReviewsForMovie(cmsAdapter, movie.id))
  const allReviews = await Promise.all(reviewPromises)

  const moviesWithRatings = movies.map((movie, index) => {
    const recentReviews = filterRecentReviews(allReviews[index])
    if (recentReviews.length === 0) return null
    return {
      id: movie.id,
      title: movie.title,
      image: movie.image,
      averageRating: calculateAverageRating(recentReviews),
    }
  })

  return moviesWithRatings.sort((a, b) => b.averageRating - a.averageRating).slice(0, 5)
}
