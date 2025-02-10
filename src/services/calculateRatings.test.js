import { expect, jest } from '@jest/globals'
import { calculateAverageRating } from './calculateRatings.js'

describe('calculateAverageRating()', () => {
  it('should return average rating for a movie', async () => {
    const cmsAdapter = {
      loadReviewsForMovie: jest.fn(async (movieId, page, pageSize) => {
        const reviews = {
          1: {
            data: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
            meta: { pagination: { pageCount: 1 } },
          },
          2: {
            data: [{ rating: 2 }, { rating: 3 }],
            meta: { pagination: { pageCount: 1 } },
          },
          3: {
            data: [{ rating: 4 }, { rating: 4 }],
            meta: { pagination: { pageCount: 1 } },
          },
          4: {
            data: [{ rating: 1 }, { rating: 2 }],
            meta: { pagination: { pageCount: 1 } },
          },
          5: {
            data: [{ rating: 3 }, { rating: 2 }, { rating: 3 }],
            meta: { pagination: { pageCount: 1 } },
          },
          6: {
            data: [{ rating: 5 }, { rating: 5 }, { rating: 5 }],
            meta: { pagination: { pageCount: 1 } },
          },
        }
        return reviews[page] || { data: [], meta: { pagination: { pageCount: 1 } } }
      }),
    }

    const getTitle = jest.fn(async (movieId) => {
      const mockTitles = {
        1: { title: 'Movie A' },
        2: { title: 'Movie B' },
        3: { title: 'Movie C' },
        4: { title: 'Movie D' },
        5: { title: 'Movie E' },
        6: { title: 'Movie F' },
      }
      return mockTitles[movieId] || { title: 'Unknown' }
    })

    const averageRating = await calculateAverageRating(1, cmsAdapter, getTitle)

    expect(averageRating).toBeCloseTo(3.5, 1)
  })
})

describe('calculateAverageRating()', () => {
  it('should return average rating from omdb', async () => {
    const cmsAdapter = {
      loadReviewsForMovie: jest.fn(async (movieId, page, pageSize) => {
        const reviews = {
          1: {
            data: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
            meta: { pagination: { pageCount: 1 } },
          },
        }
        return reviews[page] || { data: [], meta: { pagination: { pageCount: 1 } } }
      }),
    }

    const getTitle = jest.fn(async (movieId) => {
      const mockTitles = { 1: { title: 'Movie A' } }
      return mockTitles[movieId] || { title: 'Unknown' }
    })

    const getExtraReviews = jest.fn((movieId) => {
      const reviews = {
        1: {
          review: 7.0,
        },
      }
      return reviews[movieId].review || { review: 'unknown' }
    })

    const averageRating = await calculateAverageRating(1, cmsAdapter, getTitle, getExtraReviews)
    expect(averageRating).toBeCloseTo(3.5, 1)
  })
})
