import screeningAdapter from './fetchScreenings.js'

export async function getScreeningsForMovies(screeningAdapter, movieIds = []) {
  let screenings = []
  const fetchPromises = movieIds.map((movieId) => screeningAdapter.loadScreeningsForMovie(movieId))
  if (movieIds.length === 0) {
    console.log('No movies provided, returning empty array)')
  } else {
    const response = await Promise.all(fetchPromises)
    screenings = response.flatMap((response) => response.data)
  }

  return screenings
}
