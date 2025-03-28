async function fetchAverageRating(movieId) {
  const response = await fetch(`/api/movies/${movieId}/rating`)
  const data = await response.json()
  return data.averageRating
}

const debug = false

async function displayAverageRating(movieId, debug) {
  const averageRating = await fetchAverageRating(movieId)
  const ratingContainer = document.querySelector(`.singleMovie__main-rating`)
  ratingContainer.textContent = `Snittbetyg: ${averageRating.toFixed(1)}`
  if (debug === true) {
    console.log('fetchAverageRating loaded')
    console.log(ratingContainer.textContent)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const movieId = window.location.pathname.split('/').pop()
  displayAverageRating(movieId, debug)
})
