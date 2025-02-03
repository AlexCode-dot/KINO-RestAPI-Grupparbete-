import { expect, test, jest } from '@jest/globals'
import { getTopRatedMoviesByRating } from './moviesTopRated.js'

describe('getTopRatedMoviesByRating()', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('getTopRatedMoviesByRating should return top 5 movies sorted by rating', async () => {
    jest.setSystemTime(new Date(2025, 0, 16))
    const mockCmsAdapter = {
      loadReviewsForMovie: async (movieId, page) => {
        const mockReviews = {
          1: {
            data: [
              { rating: 5, createdAt: '2025-01-01' },
              { rating: 4, createdAt: '2025-01-02' },
              { rating: 5, createdAt: '2025-01-03' },
            ],
            meta: { pagination: { pageCount: 1 } },
          },
          2: {
            data: [
              { rating: 2, createdAt: '2025-01-01' },
              { rating: 3, createdAt: '2025-01-02' },
            ],
            meta: { pagination: { pageCount: 1 } },
          },
          3: {
            data: [
              { rating: 4, createdAt: '2025-01-05' },
              { rating: 4, createdAt: '2025-01-06' },
            ],
            meta: { pagination: { pageCount: 1 } },
          },
          4: {
            data: [
              { rating: 1, createdAt: '2025-01-10' },
              { rating: 2, createdAt: '2024-12-11' },
            ],
            meta: { pagination: { pageCount: 1 } },
          },
          5: {
            data: [
              { rating: 3, createdAt: '2025-01-10' },
              { rating: 2, createdAt: '2025-01-11' },
              { rating: 3, createdAt: '2025-01-12' },
            ],
            meta: { pagination: { pageCount: 1 } },
          },
          6: {
            data: [
              { rating: 5, createdAt: '2025-01-15' },
              { rating: 5, createdAt: '2025-01-16' },
              { rating: 5, createdAt: '2025-01-17' },
            ],
            meta: { pagination: { pageCount: 1 } },
          },
        }
        return mockReviews[movieId] || { data: [], meta: { pagination: { pageCount: 1 } } }
      },
    }

    async function mockLoadMovies() {
      return [
        { id: 1, title: 'Movie A', image: 'a.jpg' },
        { id: 2, title: 'Movie B', image: 'b.jpg' },
        { id: 3, title: 'Movie C', image: 'c.jpg' },
        { id: 4, title: 'Movie D', image: 'd.jpg' },
        { id: 5, title: 'Movie E', image: 'e.jpg' },
        { id: 6, title: 'Movie F', image: 'f.jpg' },
      ]
    }

    const topMovies = await getTopRatedMoviesByRating(mockCmsAdapter, mockLoadMovies)

    expect(topMovies).toHaveLength(5)
    expect(topMovies).toEqual([
      { id: 6, title: 'Movie F', image: 'f.jpg', averageRating: 5.0 },
      { id: 1, title: 'Movie A', image: 'a.jpg', averageRating: 4.7 },
      { id: 3, title: 'Movie C', image: 'c.jpg', averageRating: 4.0 },
      { id: 5, title: 'Movie E', image: 'e.jpg', averageRating: 2.7 },
      { id: 2, title: 'Movie B', image: 'b.jpg', averageRating: 2.5 },
    ])
  })
})
