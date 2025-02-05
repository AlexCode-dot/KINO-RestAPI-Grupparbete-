function createScreenings(data) {
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

    dateContainer.addEventListener('click', () => {
      console.log('clicked date:', data.id)
    })
  })
  console.log('createScreenings function has been run')
  console.log(data)
}

//Not finished. Needs to be typed correct with error handling.
addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/api/test')
  const screeningData = await response.json()
  console.log(screeningData)
  createScreenings(screeningData.data)
})
