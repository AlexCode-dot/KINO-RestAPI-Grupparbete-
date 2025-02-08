import request from 'supertest'
import express from 'express'
import { expect, test, jest } from '@jest/globals'
import apiRoutes from '../src/routes/apiRoutes.js' // Anpassa sökvägen till din routes-fil

describe('GET /api/movies/top-rated', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('should return max 5 top-rated movies sorted by rating, with expected json data', async () => {
    jest.setSystemTime(new Date(2025, 0, 16))

    const mockMovies = [
      { id: 1, title: 'Movie A', image: 'imageA.jpg' },
      { id: 2, title: 'Movie B', image: 'imageB.jpg' },
      { id: 3, title: 'Movie C', image: 'imageC.jpg' },
      { id: 4, title: 'Movie D', image: 'imageD.jpg' },
      { id: 5, title: 'Movie E', image: 'imageE.jpg' },
      { id: 6, title: 'Movie F', image: 'imageF.jpg' }, // Ska inte komma med i top 5
    ]

    const mockReviews = {
      1: [{ id: 101, createdAt: '2025-02-01', rating: 5 }],
      2: [{ id: 201, createdAt: '2025-02-03', rating: 4 }],
      3: [{ id: 301, createdAt: '2025-02-02', rating: 3 }],
      4: [{ id: 401, createdAt: '2025-02-01', rating: 2 }],
      5: [{ id: 501, createdAt: '2025-02-03', rating: 1 }],
      6: [{ id: 601, createdAt: '2024-12-01', rating: 5 }], // Äldre än 30 dagar → ska filtreras bort
    }

    const mockCmsAdapter = {
      loadReviewsForMovie: async (movieId) => {
        return {
          data: mockReviews[movieId] || [],
          meta: { pagination: { pageCount: 1, pageSize: 10 } },
        }
      },
    }

    const mockLoadMovies = async () => mockMovies

    const app = express()
    app.use(express.json())
    app.use('/api', apiRoutes({ loadMovies: mockLoadMovies, cmsAdapter: mockCmsAdapter }))

    const response = await request(app).get('/api/movies/top-rated')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)

    const movies = response.body

    expect(movies.length).toBeLessThanOrEqual(5)

    for (let i = 0; i < movies.length - 1; i++) {
      expect(movies[i].averageRating).toBeGreaterThanOrEqual(movies[i + 1].averageRating)
    }

    movies.forEach((movie) => {
      expect(movie).toHaveProperty('id')
      expect(movie).toHaveProperty('title')
      expect(movie).toHaveProperty('image')
      expect(movie).toHaveProperty('averageRating')
      expect(typeof movie.averageRating).toBe('number')
    })
  })
})
