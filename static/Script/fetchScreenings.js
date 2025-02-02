let movieId = '9'
const queryString = movieId ? `?movieId=${movieId}` : ''

fetch(`/api/movies/screenings${queryString}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then((screenings) => {
    console.log('Received screenings:', screenings)
    if (screenings.length === 0) {
      console.warn('No screenings found')
    }
    screenings.forEach((screening) => {
      document.querySelector('.screenings-list').innerHTML += `<li>${screening.movie.title}</li>`
    })
  })
  .catch((error) => console.error('Error fetching screenings:', error))
