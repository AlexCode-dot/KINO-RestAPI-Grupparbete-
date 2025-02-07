const createScreeningsAdapter = {
  fetchScreeningsData: async () => {
    const currentUrl = window.location.href
    const movieID = currentUrl.split('/').pop()

    const url = '/api/movies/screenings'
    const urlWithParam = url + `?movieId=${movieID}`
    try {
      const response = await fetch(urlWithParam)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      const screeningData = await response.json()
      return screeningData
    } catch (error) {
      console.error(`Error fetching screening data: ${error.message}`)
    }
  },
  renderScreenings: (data) => {
    const scrContainer = document.querySelector('.singleMovie__screenings')
    scrContainer.innerHTML = ''
    data.forEach((data) => {
      const dateContainer = document.createElement('a')
      dateContainer.href = '#'
      dateContainer.classList.add('screenings__dateContainer')
      scrContainer.appendChild(dateContainer)

      const room = document.createElement('span')
      room.classList.add('screenings__room')
      room.innerHTML = data.attributes.room
      dateContainer.appendChild(room)

      const date = document.createElement('span')
      date.classList.add('screenings__date')
      date.innerHTML = data.attributes.start_time.split('T')[0]
      dateContainer.appendChild(date)

      const time = document.createElement('span')
      time.classList.add('screenings__time')
      time.innerHTML = data.attributes.start_time.split('T')[1].slice(0, 5)
      dateContainer.appendChild(time)

      dateContainer.addEventListener('click', () => {
        console.log('clicked date:', data.id)
      })
    })
  },
}

async function createScreeningsDOM(createScreeningsAdapter) {
  const screeningData = await createScreeningsAdapter.fetchScreeningsData()
  createScreeningsAdapter.renderScreenings(screeningData.data)
}

document.addEventListener('DOMContentLoaded', () => createScreeningsDOM(createScreeningsAdapter))
