import { filterRecentReviews, calculateAverageRating, getAllReviewsForMovie } from './reviewsService.js'

export async function getTopRatedMoviesByRating(cmsAdapter, loadMovies) {
  const movies = await loadMovies()
  const moviesWithRatings = []

  for (const movie of movies) {
    const allReviews = await getAllReviewsForMovie(cmsAdapter, movie.id)
    const recentReviews = filterRecentReviews(allReviews)
    const averageRating = calculateAverageRating(recentReviews)

    if (recentReviews.length > 0) {
      moviesWithRatings.push({
        id: movie.id,
        title: movie.title,
        image: movie.image,
        averageRating,
      })
    }
  }

  const topRatedMovies = moviesWithRatings.sort((a, b) => b.averageRating - a.averageRating).slice(0, 5)

  return topRatedMovies
}
