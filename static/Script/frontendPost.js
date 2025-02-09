document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.querySelector('.singleMovie__addReviews')

  if (!reviewForm) {
    console.error('Formuläret hittades inte!')
    return
  }

  reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault() // Prevents page from reloading
    console.log('Formuläret skickas!')

    const movieID = window.location.pathname.split('/').pop()
    const comment = document.querySelector('.review-textarea').value
    const rating = document.querySelector('.rating-dropdown').value
    const author = document.querySelector('.name-input').value

    const reviewData = {
      comment: comment,
      rating: parseInt(rating),
      author: author,
    }

    console.log(`Movie ID: ${movieID}`)
    try {
      console.log(`Skickar request till: /api/movies/${movieID}/reviews`)
      const response = await fetch(`/api/movies/${movieID}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (response.ok) {
        console.log(reviewData)
        alert('Recension skickad!')
        reviewForm.reset()
      } else {
        alert('Något gick fel vid inskickning.')
      }
    } catch (error) {
      console.error('Fel vid fetch:', error)
      alert('Kunde inte skicka recension.')
    }
  })
})
