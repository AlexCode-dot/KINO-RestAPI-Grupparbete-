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
    console.error('Fel uppstod vid API-anrop:', error)
    return {
      reviews: [],
      meta: { pagination: { page, pageCount: 0, total: 0 } },
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
  updatePaginationButtons(hasMore, meta)
}

/*Aktiverar eller inaktiverar knapparna för "Föregående" och "Nästa" baserat på:
Om vi är på den första sidan (currentPage === 1).
Om det finns fler recensioner att visa (hasMore)*/
function updatePaginationButtons(hasMore, meta) {
  const prevBtn = document.querySelector('#prevBtn')
  const nextBtn = document.querySelector('#nextBtn')
  const paginationInfo = document.querySelector('#pagination-info')

  if (!prevBtn || !nextBtn || !paginationInfo) {
    console.error('Pagineringsknappar eller paginerings-information saknas i DOM:en!')
    return
  }

  prevBtn.disabled = currentPage === 1
  nextBtn.disabled = !hasMore
  paginationInfo.textContent = `Sida ${meta.pagination.page} av ${meta.pagination.pageCount}`
}

// Rendera recensioner i DOM:en
function renderReviews(reviews) {
  const reviewsList = document.querySelector('#reviews-list')
  if (!reviewsList) {
    console.error('Recensions lista saknas i DOM:en!')
    return
  }

  while (reviewsList.firstChild) {
    reviewsList.removeChild(reviewsList.firstChild)
  }

  if (!reviews || reviews.length === 0) {
    const fallback = document.createElement('p')
    fallback.textContent = 'Inga recensioner tillgängliga, var den första att recensera!'
    reviewsList.appendChild(fallback)
    return
  }

  // Loopar igenom alla recensioner och skapar HTML för dem
  reviews.forEach((review) => {
    const reviewDiv = document.createElement('div')
    reviewDiv.classList.add('review')

    // VÄNSTER, skapa betyget
    const rating = document.createElement('span')
    rating.classList.add('rating')
    rating.textContent = `${review.rating}/10`

    // HÖGER, Skapa namnet
    const author = document.createElement('span')
    author.classList.add('name')
    author.textContent = review.author || 'Anonym'

    // SIST, Skapa recensionen
    const commentPara = document.createElement('p')
    commentPara.classList.add('comment')
    commentPara.textContent = review.comment

    // Lägger elementen i reviewDiv
    reviewDiv.appendChild(rating)
    reviewDiv.appendChild(author)
    reviewDiv.appendChild(commentPara)

    // Lägger till recensionen i listan
    reviewsList.appendChild(reviewDiv)
  })
}

// När DOM:en är laddad sker hämtning av recensioner och knapplyssnare
document.addEventListener('DOMContentLoaded', () => {
  loadReviews(movieId)

  const prevBtn = document.querySelector('#prevBtn')
  const nextBtn = document.querySelector('#nextBtn')

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage -= 1
        loadReviews(movieId)
      }
    })
  } else {
    console.error('Föregående knappen saknas i DOM:en')
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentPage += 1
      loadReviews(movieId)
    })
  } else {
    console.error('Nästa knappen saknas i DOM:en')
  }
})
