import { createStars } from './ratingStars.js'

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname !== '/') {
    return
  }

  try {
    const response = await fetch('/api/movies/top-rated')

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error)
    }

    const topRatedMovies = await response.json()
    createtopRatedMovies(topRatedMovies)
  } catch (error) {
    console.error('Fel vid hämtning av filmer med högst betyg:', error.message)
  }
})

async function createtopRatedMovies(movies) {
  const moviesContainer = document.querySelector('.top-rated__container')

  movies.forEach((movie) => {
    const movieElement = document.createElement('li')
    movieElement.classList.add('top-rated__movie')
    moviesContainer.appendChild(movieElement)

    const movieLink = document.createElement('a')
    movieLink.setAttribute('href', `/movies/${movie.id}`)
    movieElement.appendChild(movieLink)

    const movieImage = document.createElement('img')
    movieImage.classList.add('top-rated__movie-image')
    movieImage.setAttribute('src', movie.image.url)
    movieLink.appendChild(movieImage)

    const movieTitle = document.createElement('h4')
    movieTitle.classList.add('top-rated__movie-title')
    movieTitle.textContent = movie.title
    movieLink.appendChild(movieTitle)

    const stars = createStars(movie.averageRating)
    movieLink.appendChild(stars)

    const movieRating = document.createElement('p')
    movieRating.classList.add('top-rated__movie-rating')
    movieRating.textContent = movie.averageRating
    movieLink.appendChild(movieRating)
  })
}
