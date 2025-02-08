document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.querySelector('.singleMovie__addReviews')

  if (!reviewForm) {
    console.error('Formuläret hittades inte!')
    return
  }

  reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault() // Prevents page from reloading

    console.log('Yay! Page is not reloading!')

    const comment = document.querySelector('.review-textarea').value
    const rating = document.querySelector('.rating-dropdown').value
    const author = document.querySelector('.name-input').value

    const reviewData = {
      comment: comment,
      rating: parseInt(rating),
      author: author,
    }

    console.log('reviewData: ' + reviewData.comment, reviewData.rating, reviewData.author)

    const movieID = window.location.pathname.split('/').pop()
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
