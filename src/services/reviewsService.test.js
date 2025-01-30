import { getAllReviewsForMovie } from './reviewsService'

describe('reviewsService', () => {
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
})
