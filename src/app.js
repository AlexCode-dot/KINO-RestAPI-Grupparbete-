import express from 'express'
import ejsMate from 'ejs-mate'
import renderPage from './lib/renderPage.js'
import { filmExists } from './services/fetchMovies.js'
import { renderErrorPage } from './lib/errorHandler.js'

export default function initApp(api) {
  const app = express()

  app.engine('ejs', ejsMate)
  app.set('view engine', 'ejs')
  app.set('views', './templates')

  app.get('/', async (request, response, next) => {
    try {
      const movies = await api.loadMovies()
      await renderPage(response, 'filmer', { movies })
    } catch (err) {
      next(err)
    }
  })

  app.get('/movies/:movieId', async (request, response, next) => {
    try {
      const movieId = request.params.movieId
      if (!(await filmExists(movieId))) {
        response.status(404)
        return renderErrorPage(response, 404, 'Sidan kunde inte hittas', 'Filmen kunde inte hittas')
      }

      const movie = await api.loadMovie(movieId)
      await renderPage(response, 'film', { movie })
    } catch (err) {
      next(err)
    }
  })

  app.get('/barnbio', async (request, response, next) => {
    try {
      renderPage(response, 'barnbio')
    } catch (err) {
      next(err)
    }
  })

  app.get('/evenemang', async (request, response, next) => {
    try {
      renderPage(response, 'evenemang')
    } catch (err) {
      next(err)
    }
  })

  app.get('/omoss', async (request, response, next) => {
    try {
      renderPage(response, 'omoss')
    } catch (err) {
      next(err)
    }
  })

  app.get('/loggain', async (request, response, next) => {
    try {
      renderPage(response, 'loggain')
    } catch (err) {
      next(err)
    }
  })

  app.use('/static', express.static('./static'))

  // Testfel route för 500
  app.get('/test-error', (request, response, next) => {
    const error = new Error('Detta är ett avsiktligt testfel.')
    error.status = 500
    next(error)
  })

  app.use((request, response) => {
    renderErrorPage(response, 404, 'Sidan kunde inte hittas', 'Sidan finns inte')
  })

  app.use((err, request, response, next) => {
    console.error('Ett serverfel inträffade:', err)
    const status = err.status || 500
    renderErrorPage(response, status, 'Tekniskt fel', 'Ett oväntat fel inträffade. Försök igen senare.')
  })

  return app
}
