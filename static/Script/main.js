import { fetchTopRatedMovies } from './fetchTopRated.js'
import { errorFeedback } from './error.js'
import { createMovies, displayEmptyMessage } from './uiRenderer.js'

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname !== '/') {
    return
  }
  const moviesContainer = document.querySelector('.top-rated__container')

  try {
    const topRatedMovies = await fetchTopRatedMovies()

    if (topRatedMovies.length === 0) {
      displayEmptyMessage('Inga filmer hittades.', moviesContainer)
    } else {
      createMovies(topRatedMovies, moviesContainer)
    }
  } catch (error) {
    errorFeedback(error, moviesContainer)
  }
})
