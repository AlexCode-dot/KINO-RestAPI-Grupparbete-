document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.querySelector('.singleMovie__addReviews')

  reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault() // Prevents page from reloading

    const comment = document.querySelector('.review-textarea').value
    const rating = document.querySelector('.rating-dropdown').value
    const author = document.querySelector('.name-input').value

    const reviewData = {
      comment: comment,
      rating: parseInt(rating),
      author: author,
    }

    try {
      const response = await fetch('/api/movies/:id/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (response.ok) {
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
