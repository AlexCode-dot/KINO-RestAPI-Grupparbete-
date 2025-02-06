//Test to see if loadReviewsForMovie is capable of handling an API response in several pages

import { loadReviewsForMovie } from 'static/Script/loadReviews.js'

global.fetch = jest.fn()

describe('pagineringstester', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('Bör fetcha sida 2 på förfrågan', async () => {
    const movieId = '123'
    const page = 2
    const pageSize = 5

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        reviews: [{ id: 6, comment: 'Nice plot!' }],
        meta: { pagination: { page: 2, pageCount: 5 } },
      }),
    })

    const result = await loadReviewsForMovie(movieId, page, pageSize)

    //Testing if API-Call is made to page 2
    expect(fetch).toHaveBeenCalledWith(`/api/movies/${movieId}/reviews?page=2&pageSize=5`)
    expect(result.reviews).toEqual([{ id: 6, comment: 'Nice plot!' }])
    expect(result.meta.pagination.page).toBe(2)
  })
})
