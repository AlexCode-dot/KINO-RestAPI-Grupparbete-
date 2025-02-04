import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest } from '@jest/globals'
import { getScreeningsForMovies, getScreeningsForNextFiveDays } from './screeningsService.js'

function mockScreening(idNr, movieId = 101) {
  return {
    id: idNr,
    start_time: '2025-02-13T17:00:00.000Z',
    movie: {
      id: movieId,
      title: 'Movie title',
    },
  }
}

describe('getScreeningsForMovies', () => {
  it('should fetch all screenings if no movie ID is provided', async () => {
    const screeningAdapter = {
      loadAllScreenings: async () => ({
        data: [mockScreening(1), mockScreening(2)],
      }),
      loadScreeningsForMovie: () => {
        throw new Error('Should not be called')
      },
    }

    const screenings = await getScreeningsForMovies(screeningAdapter)
    expect(screenings).toHaveLength(2)
    expect(screenings).toContainEqual(mockScreening(1))
    expect(screenings).toContainEqual(mockScreening(2))
  })

  /* it ('should fetch screenings for specific movie-ID', async () => {

    })

    it ('should fetch screenings for specific movie-ID', async () => {
        
    })*/
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
