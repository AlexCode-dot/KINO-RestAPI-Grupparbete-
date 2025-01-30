import express from 'express'
import ejsMate from 'ejs-mate'
import renderPage from './lib/renderPage.js'
import { filmExists } from './services/fetchMovies.js'
import { renderErrorPage } from './lib/errorHandler.js'
import router from './services/fetchReviews.js'

export default function initApp(api) {
  const app = express()

  app.engine('ejs', ejsMate)
  app.set('view engine', 'ejs')
  app.set('views', './templates')

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

  app.use('/static', express.static('./static'))
  app.use('/api/reviews', router) //Anslutning av reviews routern

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

/*
app.js definierar express applikationen

Vi hanterar olika routes och felhantering i denna fil.
ÖVERST importeras modulerna:
express: Importerar Express för att skapa en webserver.
ejs-mate: Ett "engine" för att rendera EJS-vyer med en lättare syntax.
renderPage: En funktion som renderar olika sidor baserat på mallar.
filmExists: En funktion för att kolla om en film finns.
renderErrorPage: En funktion för att hantera fel och visa fel-sidor.


INITIERING av applikationen=
export default function initApp(api) {
const app = express()  

START av applikationen=
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', './templates') 

ejs används för att rendera HTML-mallar.
ejs-mate används för att förenkla EJS-syntaxen.
views mappen ställs in till ./templates, där mallarna ligger.

/: Renderar startsidan (hem).
/filmer: Hämtar en lista med filmer från API:et och renderar filmer-sidan.
/movies/:movieId: Hämtar och renderar en specifik film baserat på movieId. 
Om filmen inte finns, renderas en fel-sida.
/barnbio: Renderar sidan för barnbio.
/evenemang: Renderar sidan för evenemang.
/omoss: Renderar sidan om oss.
/loggain: Renderar logga in-sidan.

Varje block använder renderPage för att rendera rätt EJS-mall 
med relevant data (t.ex. filmer eller innehåll).

HANTERING av statiska filer=
app.use('/static', express.static('./static'))
Denna serverar statisk data ur mappen ./static
såsom bilder, css eller js.

TEST-FELS ROUTE som simulerar ett serverfel=
app.get('/test-error', (request, response, next) => {
  const error = new Error('Detta är ett avsiktligt testfel.')
  error.status = 500
  next(error)
})

Funktionen initApp returnerar Express-applikationen 
som kan startas senare.
För att returnera applikationen anv.
return app

*/
