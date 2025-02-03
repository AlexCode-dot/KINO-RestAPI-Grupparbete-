import screeningAdapter from './fetchScreenings.js'

export async function getScreeningsForMovies(screeningAdapter, movieIds = []) {
  let screenings = []

  if (movieIds.length === 0) {
    const response = await screeningAdapter.loadAllScreenings()
    return response.data
  } else {
    const fetchPromises = movieIds.map((movieId) => screeningAdapter.loadScreeningsForMovie(movieId))
    const response = await Promise.all(fetchPromises)
    screenings = response.flatMap((response) => response.data)
  }
}
