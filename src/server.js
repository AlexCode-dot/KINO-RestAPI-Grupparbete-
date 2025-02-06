import { loadMovie, loadMovies } from './services/fetchMovies.js'
import initApp from './app.js'

const api = {
  loadMovie,
  loadMovies,
}

const app = initApp(api)
const port = process.env.PORT || 5080

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
