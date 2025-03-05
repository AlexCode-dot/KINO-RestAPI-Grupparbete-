import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest } from '@jest/globals'
import {
  getScreeningsForMovies,
  getScreeningsForNextFiveDays,
  getAllScreeningsForOneMovie,
} from './screeningsService.js'

function mockScreening(screeningId, movieId) {
  return {
    id: screeningId,
    start_time: '2025-02-13T17:00:00.000Z',
    room: 'Stora salongen',
    movie: {
      id: movieId,
      title: 'Fire Walk With Me',
    },
  }
}

describe('getScreeningsForMovies', () => {
  it('should fetch all screenings if no movie ID is provided', async () => {
    const screeningAdapter = {
      loadAllScreenings: async () => ({
        data: [mockScreening(1, 3), mockScreening(2, 84)],
      }),
    }

    const screenings = await getScreeningsForMovies(screeningAdapter)
    expect(screenings).toHaveLength(2)
    expect(screenings).toContainEqual(mockScreening(1, 3))
    expect(screenings).toContainEqual(mockScreening(2, 84))
  })

  it('should fetch screenings for specific movie-ID', async () => {
    const movieId = 101
    const screeningAdapter = {
      loadScreeningsForMovie: async (movieId) => ({
        data: [
          mockScreening(1, movieId),
          mockScreening(2, movieId),
          mockScreening(3, movieId),
          mockScreening(4, movieId),
        ],
      }),
    }
    const screenings = await getScreeningsForMovies(screeningAdapter, [movieId])
    expect(screenings).toHaveLength(4)
    expect(screenings).toContainEqual(mockScreening(3, movieId))
  })

  it('should return an empty array if requested movieId have no match', async () => {
    const screeningAdapter = {
      loadScreeningsForMovie: async (movieId) => ({
        data:
          movieId === 999
            ? []
            : [
                mockScreening(1, movieId),
                mockScreening(2, movieId),
                mockScreening(3, movieId),
                mockScreening(4, movieId),
              ],
      }),
    }
    const screenings = await getScreeningsForMovies(screeningAdapter, [999])
    expect(screenings).toHaveLength(0)
  })
})

describe('getScreeningForNextFiveDays', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should fetch screenings for the following 5 days', async () => {
    jest.setSystemTime(new Date(2025, 0, 1))
    const screeningAdapter = {
      loadScreeningsForDate: async (formattedDate) => ({
        data: [mockScreening(1, formattedDate), mockScreening(2, formattedDate)],
      }),
    }
    const screenings = await getScreeningsForNextFiveDays(screeningAdapter)
    expect(screenings).toHaveLength(10)
  })

  it('should only show a maximum of 10 screenings', async () => {
    jest.setSystemTime(new Date(2025, 0, 1))
    const screeningAdapter = {
      loadScreeningsForDate: async (formattedDate) => ({
        data: [mockScreening(1, formattedDate), mockScreening(1, formattedDate), mockScreening(1, formattedDate)],
      }),
    }
    const screenings = await getScreeningsForNextFiveDays(screeningAdapter)
    expect(screenings).toHaveLength(10)
  })
})

describe('getAllScreeningsForOneMovie', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('should work if data consists of only one page', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2025, 1, 8))

    const screeningAdapter = {
      loadScreeningsForOneMovie: async () => {
        return {
          data: [{ id: 1, attributes: { start_time: '2025-02-10T15:00:00.000Z' } }],
          meta: { pagination: { pageCount: 1 } },
        }
      },
    }

    const screenings = await getAllScreeningsForOneMovie(screeningAdapter)
    expect(screenings.data).toHaveLength(1)
  })

  test('should work if data consists of more than one page', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2025, 1, 8))

    const screeningAdapter = {
      loadScreeningsForOneMovie: async (id, page) => {
        if (page === 1) {
          return {
            data: [{ id: 1, attributes: { start_time: '2025-02-10T15:00:00.000Z' } }],
            meta: { pagination: { pageCount: 2 } },
          }
        }
        if (page === 2) {
          return {
            data: [{ id: 1, attributes: { start_time: '2025-02-11T15:00:00.000Z' } }],
            meta: { pagination: { pageCount: 2 } },
          }
        }
        return { data: [], meta: { pagination: { pageCount: 2 } } }
      },
    }

    const screenings = await getAllScreeningsForOneMovie(screeningAdapter)
    expect(screenings.data).toHaveLength(2)
  })

  test('tests that the function does not return objects past current date', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2025, 1, 8))

    const screeningAdapter = {
      loadScreeningsForOneMovie: async () => {
        return {
          data: [
            { id: 1, attributes: { start_time: '2025-02-10T15:00:00.000Z' } },
            { id: 2, attributes: { start_time: '2025-02-07T15:00:00.000Z' } },
          ],
          meta: { pagination: { pageCount: 1 } },
        }
      },
    }

    const screenings = await getAllScreeningsForOneMovie(screeningAdapter)
    expect(screenings.data).toHaveLength(1)
  })

  test('tests that object become sorted with date/time correctly', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2025, 1, 1))

    const screeningAdapter = {
      loadScreeningsForOneMovie: async () => {
        return {
          data: [
            { id: 1, attributes: { start_time: '2025-02-10T15:00:00.000Z' } },
            { id: 2, attributes: { start_time: '2025-02-07T15:00:00.000Z' } },
            { id: 3, attributes: { start_time: '2025-02-07T16:00:00.000Z' } },
          ],
          meta: { pagination: { pageCount: 1 } },
        }
      },
    }

    const screenings = await getAllScreeningsForOneMovie(screeningAdapter)
    expect(screenings.data).toHaveLength(3)
    expect(screenings.data[0].id).toBe(2)
    expect(screenings.data[1].id).toBe(3)
    expect(screenings.data[2].id).toBe(1)
  })
})
