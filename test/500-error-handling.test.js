import { expect, test } from '@jest/globals'
import request from 'supertest'
import initApp from '../src/app.js'

describe('500 Error Handling', () => {
  test('Verify that any server errors returns a 500 error with the correct message', async () => {
    const mockApi = {
      loadMovies: async () => [],
      loadMovie: async () => null,
    }

    const app = initApp(mockApi)

    const response = await request(app).get('/test-error')
    expect(response.status).toBe(500)
    expect(response.text).toContain('Tekniskt fel')
    expect(response.text).toContain('Ett oväntat fel inträffade. Försök igen senare.')
  })

  test('should handle 500 errors if loadMovie fails', async () => {
    const mockApi = {
      loadMovies: async () => [],
      loadMovie: async () => {
        throw new Error('Test 500 Error')
      },
    }
    const app = initApp(mockApi)

    const response = await request(app).get('/movies/1')

    expect(response.status).toBe(500)
    expect(response.text).toContain('Tekniskt fel')
    expect(response.text).toContain('Ett oväntat fel inträffade')
  })
})
