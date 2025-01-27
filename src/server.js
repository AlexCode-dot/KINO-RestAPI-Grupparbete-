import { loadMovie, loadMovies } from './services/fetchMovies.js'
import initApp from './app.js'

const api = {
  loadMovie,
  loadMovies,
}

const app = initApp(api)
app.listen(5080)
