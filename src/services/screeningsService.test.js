import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest } from '@jest/globals'
import { getScreeningsForMovies, getScreeningsForNextFiveDays } from './screeningsService.js'

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

/*
describe('getScreeningForNextFiveDays', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.clearAllTimers()
    })

    it ('should fetch screenings for the following 5 days', async () => {

    })

    it ('should only show a maximum of 10 screenings', async () => {

    })

})
*/
