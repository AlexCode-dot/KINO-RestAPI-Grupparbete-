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

  return screenings
}

export async function getScreeningsForNextFiveDays(screeningAdapter) {
  const screenings = []
  const now = new Date()
  for (let i = 0; i < 5; i++) {
    const date = new Date(now)
    date.setDate(now.getDate() + i)
    const formattedDate = date.toISOString().split('T')[0]
    const response = await screeningAdapter.loadScreeningsForDate(formattedDate)
    screenings.push(...response.data)
  }

  return screenings.slice(0, 10)
}
