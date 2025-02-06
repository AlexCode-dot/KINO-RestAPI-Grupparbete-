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

  return screenings
}

export async function getAllScreeningsForOneMovie(screeningAdapter, id) {
  const allScreenings = []
  const page = 1
  const pageSize = 100

  const firstPage = await screeningAdapter.loadScreeningsForOneMovie(id, page, pageSize)
  allScreenings.push(...firstPage.data)

  const totalPages = firstPage.meta.pagination.pageCount

  while (page < totalPages) {
    page++
    const allScreeningsLoop = await screeningAdapter.loadScreeningsForOneMovie(id, page, pageSize)
    allScreenings.push(...allScreeningsLoop.data)
  }

  const currentDate = new Date()

  const futureScreenings = allScreenings.filter((screening) => {
    const screeningDate = new Date(screening.attributes.start_time)
    return screeningDate >= currentDate
  })

  const sortedScreenings = futureScreenings.sort((a, b) => {
    return new Date(a.attributes.start_time) - new Date(b.attributes.start_time)
  })

  return { data: sortedScreenings }
}
