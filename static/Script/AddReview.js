document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.singleMovie__addReviews')

  if (!form) {
    console.warn('Recensionsformuläret kunde inte hittas.')
    return
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    console.log('Formuläret skickas...')

    const movieID = window.location.pathname.split('/').pop()
    const reviewData = {
      comment: document.querySelector('.review-textarea')?.value.trim(),
      rating: parseInt(document.querySelector('.rating-dropdown')?.value, 10),
      author: document.querySelector('.name-input')?.value.trim(),
    }

    if (!reviewData.comment || !reviewData.rating || !reviewData.author) {
      alert('Alla fält måste fyllas i.')
      return
    }

    try {
      console.log(`Skickar POST-request till: /api/movies/${movieID}/reviews`)
      console.log('Review data:', reviewData)

      const response = await fetch(`/api/movies/${movieID}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      })

      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (!response.ok) throw new Error(`Inskickningen misslyckades: ${response.statusText}`)

      console.log('Recension skickad:', reviewData)
      alert('Din recension har skickats!')
      if (form && typeof form.reset === 'function') {
        form.reset()
      }
    } catch (error) {
      console.error('Ett fel inträffade:', error)
      alert('Något gick fel, försök igen.')
    }
  })
})
