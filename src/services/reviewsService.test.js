import { describe, expect, jest } from '@jest/globals'
import { getAllReviewsForMovie, filterRecentReviews, calculateAverageRating } from './reviewsService'

describe('reviewsService', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('getAllReviewsForMovie should fetch and combine reviews from multiple pages', async () => {
    const mockCmsAdapter = {
      loadReviewsForMovie: async (movieId, page) => {
        if (page === 1) {
          return {
            data: [
              { id: 101, rating: 5 },
              { id: 102, rating: 4 },
            ],
            meta: { pagination: { pageCount: 2 } },
          }
        }
        if (page === 2) {
          return {
            data: [{ id: 103, rating: 3 }],
            meta: { pagination: { pageCount: 2 } },
          }
        }
        return { data: [], meta: { pagination: { pageCount: 2 } } }
      },
    }

    const movieId = 1
    const reviews = await getAllReviewsForMovie(mockCmsAdapter, movieId)

    expect(reviews).toHaveLength(3)
    expect(reviews).toEqual([
      { id: 101, rating: 5 },
      { id: 102, rating: 4 },
      { id: 103, rating: 3 },
    ])
  })

  test('filterRecentReviews filters out reviews older than 30 days', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2025, 1, 16))

    const reviews = [
      { id: 1, createdAt: '2025-01-15T00:00:00.000Z', rating: 5 },
      { id: 2, createdAt: '2025-01-27T00:00:00.000Z', rating: 4 },
      { id: 3, createdAt: '2025-02-11T00:00:00.000Z', rating: 3 },
    ]

    const recentReviews = filterRecentReviews(reviews)

    expect(recentReviews).toHaveLength(2)
    expect(recentReviews[0].id).toBe(2)
    expect(recentReviews[1].id).toBe(3)
  })

  test('calculateAverageRating returns the correct average rating from reviews', () => {
    const reviews = [
      { id: 1, rating: 5 },
      { id: 2, rating: 4 },
      { id: 3, rating: 3 },
    ]

    const avgRating = calculateAverageRating(reviews)

    expect(avgRating).toBe(4)
  })

  test('calculateAverageRating returns 0 for empty reviews', () => {
    const avgRating = calculateAverageRating([])

    expect(avgRating).toBe(0)
  })
})
