/*This is a mocked test to simulate an API response, I call the function loadReviewsForMovie with test-data and
I am making sure the fetch is called with the right URL and that we get correct data in return*/

import { loadReviewsForMovie } from 'static/Script/loadReviews.js'

//We don`t want to use real API calls, so we do a MOCKED global fetch to find out how loadReviewsForMovie is doing out there
global.fetch = jest.fn()

//Resetting the mocked fetch before every test, we don`t want any remains from previous tests
beforeEach(() => {
  fetch.mockClear()
})

//MY First test is to see if we are calling the correct endpoint (URL) and if we are getting the correct answer
it('Bör kalla på rätt endpoint', async () => {
  //Testdata defined to simulate API call
  const movieId = '123'
  const page = 1
  const pageSize = 5

  //Returning a successful answer with json, http status 200, in arrayform. Metadata describes pagination.
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      reviews: [{ id: 1, comment: 'Great movie!' }],
      meta: { pagination: { page: 1, pageCount: 5 } },
    }),
  })

  /*Calling loadRevForMo..function with the 3 values in--->(. . .) 
      Function builds an API-URL and calls for the mocked fetch-call*/
  const result = await loadReviewsForMovie(movieId, page, pageSize)

  //This is what URL we expect in the API-call
  expect(fetch).toHaveBeenCalledWith(`/api/movies/${movieId}/reviews?page=${page}&pageSize=${pageSize}`)

  //result.reviews should contain reviews from the mocked API response
  expect(result.reviews).toEqual([{ id: 1, comment: 'Great movie!' }])
  expect(result.meta.pagination.page).toBe(1)
})
