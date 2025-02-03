let movieId = ''
const queryString = movieId ? `?movieId=${movieId}` : ''

fetch(`/api/movies/screenings${queryString}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then((screenings) => {
    console.log('Received all screenings:', screenings)
    document.querySelector('.screenings-list').innerHTML = screenings
      .map((screening) => {
        return `<li>
        ${screening.movie.title} - 
        Date: ${screening.start_time}, 
        Room: ${screening.room || 'N/A'}
      </li>`
      })
      .join('')
  })
  .catch((error) => console.error('Error fetching all screenings:', error))
