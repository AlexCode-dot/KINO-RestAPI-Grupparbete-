import express from 'express'
import ejsMate from 'ejs-mate'
import renderPage from './lib/renderPage.js'
import { filmExists } from './services/fetchMovies.js'
import { renderErrorPage } from './lib/errorHandler.js'
import apiRoutes from './routes/apiRoutes.js'

export default function initApp(api) {
  const app = express()

  app.engine('ejs', ejsMate)
  app.set('view engine', 'ejs')
  app.set('views', './templates')

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  //Route to membership profile
  app.get('/profile', (req, res) => {
    const user = {
      id: '123',
      name: 'Ronja Fagerdahlllll',
      email: 'ronja@example.com',
    }

    res.render('profile', { user })
  })

  app.post('/profile/update', (req, res) => {
    console.log('Medlemsinformation uppdaterad:', req.body)
    res.redirect('/profile')
  })

  app.get('/', async (request, response, next) => {
    try {
      await renderPage(response, 'hem')
    } catch (err) {
      next(err)
    }
  })

  app.get('/filmer', async (request, response, next) => {
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
  app.use(express.json())
  app.use('/api', apiRoutes(api))
  app.use('/static', express.static('./static'))

  // Testfel route för 500
  app.get('/test-error', (request, response, next) => {
    const error = new Error('Detta är ett avsiktligt testfel.')
    error.status = 500
    next(error)
  })

  app.use((request, response) => {
    if (request.originalUrl.startsWith('/api/')) {
      return response.status(404).json({ error: 'Endpoint hittades inte', status: 404 })
    }
    renderErrorPage(response, 404, 'Sidan kunde inte hittas', 'Sidan finns inte')
  })

  app.use((err, request, response, next) => {
    console.error('Ett serverfel inträffade:', err)
    const status = err.status || 500

    if (request.originalUrl.startsWith('/api/')) {
      return response.status(status).json({ error: 'Ett oväntat fel inträffade. Försök igen senare.', status })
    }
    renderErrorPage(response, status, 'Tekniskt fel', 'Ett oväntat fel inträffade. Försök igen senare.')
  })

  return app
}
