import { loadMovie, loadMovies } from './services/fetchMovies.js'
import initApp from './app.js'

const api = {
  loadMovie,
  loadMovies,
}

const app = initApp(api)


app.listen(5080, () => {
  console.log('Server running on http://localhost:5080')

const port = process.env.PORT || 5080

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)

})
