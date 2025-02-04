//Hämtar recensioner för en viss film eller de senaste recensionerna generellt
let currentPage = 1 //Aktuell sida
const pageSize = 5 //Max antal recensioner/sida
let hasMore = true //Indikation på att det finns fler sidor

const movieId = window.location.pathname.split('/').pop() //tar ut film ID:et ur webbläsarens URL
console.log('Hämtat movieId:', movieId)

//Det loggas ett fel om URL:en saknar film id
if (!movieId) {
  console.error('movieId saknas i URL:en')
}

/*Funktion: Skickar ett API-anrop till backend för att hämta recensioner för:
 en specifik film (movieId), sida (page), och antal recensioner per sida (pageSize).
Returnerar recensionerna (reviews) och metadata (meta) som behövs för paginering*/
async function loadReviewsForMovie(movieId, page, pageSize) {
  const apiUrl = `/api/movies/reviews/${movieId}?page=${page}&pageSize=${pageSize}`
  console.log('API URL:', apiUrl)

  try {
    const res = await fetch(apiUrl)
    if (!res.ok) {
      throw new Error(`API-anrop misslyckades, statuskod: ${res.status}`)
    }
    const payload = await res.json()
    console.log('API-respons:', payload)

    return {
      reviews: payload.reviews,
      meta: payload.meta,
    }
  } catch (error) {
    console.error('Fel vid API-anrop:', error)
    return {
      reviews: [],
      meta: { pagination: { page, pageCount: 0 } },
    }
  }
}

/*Anropar loadReviewsForMovie för att hämta recensioner och metadata för aktuell sida från API:et*/
async function loadReviews(movieId) {
  const { reviews, meta } = await loadReviewsForMovie(movieId, currentPage, pageSize)

  //renderar recensioner i DOM:en
  renderReviews(reviews)

  //Loggar resultat för att jag felsöker
  console.group(`Page ${meta.pagination.page}`)
  console.log('Reviews:', reviews)
  console.log('Pagination:', meta.pagination)
  console.groupEnd()

  // Kontroll om det finns fler recensioner att tillgå
  hasMore = meta.pagination.pageCount > currentPage

  //Uppdaterar pagineringsknapparna
  updatePaginationButtons(hasMore)

  //Uppdaterar sidinformation i DOM:en
  document.getElementById('pagination-info').textContent =
    `Sida ${meta.pagination.page} av ${meta.pagination.pageCount}`
}

/*Aktiverar eller inaktiverar knapparna för "Föregående" och "Nästa" baserat på:
Om vi är på den första sidan (currentPage === 1).
Om det finns fler recensioner att visa (hasMore)*/
function updatePaginationButtons(hasMore) {
  const prevBtn = document.getElementById('prevBtn')
  const nextBtn = document.getElementById('nextBtn')

  if (!prevBtn || !nextBtn) {
    console.error('Pagineringsknappar saknas i DOM:en!')
  }

  prevBtn.disabled = currentPage === 1
  nextBtn.disabled = !hasMore

  // Uppdatera sidinformation
  document.getElementById('pagination-info').textContent =
    `Sida ${meta.pagination.page} av ${meta.pagination.pageCount}`
}

// Funktion: Rendera recensioner i DOM
function renderReviews(reviews) {
  const reviewsContainer = document.getElementById('reviews-container')
  if (!reviewsContainer) {
    console.error('Reviews-container saknas i DOM:en!')
    return
  }

  if (!reviews || reviews.length === 0) {
    reviewsContainer.innerHTML = '<p>Inga recensioner tillgängliga.</p>'
    return
  }

  reviewsContainer.innerHTML = reviews
    .map(
      (review) => `
        <div class="review">
          <strong>${review.author || 'Anonym'}</strong> - ${review.rating}/10
          <p>${review.comment}</p>
        </div>
      `
    )
    .join('')
}

// Funktion: Uppdatera status för pagineringsknappar, Aktivering eller inaktivering beroende på villkor om fler sidor
// function updatePaginationButtons(hasMore) {
//   const prevBtn = document.getElementById('prevBtn')
//   const nextBtn = document.getElementById('nextBtn')
//   const paginationInfo = document.getElementById('pagination-info')

//   prevBtn.disabled = currentPage === 1
//   nextBtn.disabled = !hasMore //hasMore är false

//   paginationInfo.textContent = `Sida ${currentPage}`
// }

document.addEventListener('DOMContentLoaded', () => {
  loadReviewsForMovie(movieId, 1, 5)

  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1
      loadReviews(movieId)
    }
  })

  document.getElementById('nextBtn').addEventListener('click', () => {
    currentPage += 1
    loadReviews(movieId)
  })
})

// Initiera hämtning av recensioner vid sidladdning
loadReviews(movieId)
