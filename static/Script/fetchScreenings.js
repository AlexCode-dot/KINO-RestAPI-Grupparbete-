fetch('/api/movies/screenings/next-five-days')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then((screenings) => {
    console.log('Received screenings for next five days:', screenings)
    if (screenings.length === 0) {
      document.querySelector('.screenings-list').innerHTML = '<li>No screenings found</li>'
    } else {
      document.querySelector('.screenings-list').innerHTML = screenings
        .map((screening) => {
          return `<li>
          ${screening.movie.title} - 
          Date: ${new Date(screening.start_time).toLocaleDateString()}, 
          Time: ${new Date(screening.start_time).toLocaleTimeString()}, 
          Room: ${screening.room || 'N/A'}
        </li>`
        })
        .join('')
    }
  })
  .catch((error) => console.error('Error fetching screenings:', error))
