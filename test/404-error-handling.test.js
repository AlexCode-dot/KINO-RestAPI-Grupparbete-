import { expect, test } from '@jest/globals'
import request from 'supertest'
import initApp from '../src/app.js'

describe('404 Error Handling', () => {
  test('Verify that a non-existing movie page returns a 404 error and with the correct message', async () => {
    const api = {
      loadMovies: async () => [],
      loadMovie: async () => null,
    }

    const app = initApp(api)

    const notFoundResponse = await request(app).get('/movies/x').expect('Content-Type', /html/).expect(404)

    expect(notFoundResponse.status).toBe(404)
    expect(notFoundResponse.text).toContain('Sidan kunde inte hittas')
    expect(notFoundResponse.text).toMatch('Filmen kunde inte hittas')
  })

  test('Verify that any non-existing route returns a 404 error with the correct message', async () => {
    const mockApi = {
      loadMovies: async () => [],
      loadMovie: async () => null,
    }

    const app = initApp(mockApi)

    const notFoundResponse = await request(app).get('/invalid-route').expect('Content-Type', /html/).expect(404)

    expect(notFoundResponse.status).toBe(404)
    expect(notFoundResponse.text).toContain('Sidan kunde inte hittas')
    expect(notFoundResponse.text).toMatch('Sidan finns inte')
  })
})
