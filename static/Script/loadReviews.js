// js file to build logic and functionality for fetching of reviews and pagination for them

let currentPage = 1
const pageSize = 5
let hasMore = true

const movieId = window.location.pathname.split('/').pop() //Extracting the movie ID from the URL
console.log('Hämtat movieId:', movieId)

if (!movieId) {
  console.error('movieId saknas i URL:en')
}

/*Function: API call to Backend in order to get reviews based on our required endpoint*/
async function loadReviewsForMovie(movieId, page, pageSize) {
  const apiUrl = `/api/movies/${movieId}/reviews?page=${page}&pageSize=${pageSize}`
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

/*Calling loadReviewsForMovie to get metadata and reviews from API*/
async function loadReviews(movieId) {
  const { reviews, meta } = await loadReviewsForMovie(movieId, currentPage, pageSize)

  //Rendering reviews in the DOM structure
  renderReviews(reviews)

  //Debugging with a grouplog to show pagination info and reviews in the same log
  console.group(`Page ${meta.pagination.page}`)
  console.log('Reviews:', reviews)
  console.log('Pagination:', meta.pagination)
  console.groupEnd()

  //Control if there are more reviews available on the page, hasMore is either true or false
  hasMore = meta.pagination.pageCount > currentPage

  //Updating buttons based on hasMore-status
  updatePaginationButtons(hasMore, meta)
}

/*Activating or de-activating buttons (Nästa + Föregående in film.ejs) based on
what page we are on and however hasMore is true or false*/
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

/*Function: Render reviews in the DOM by first getting #reviews-list from the DOM and then
looping through every review, creating HTML with specific information*/
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

  reviews.forEach((review) => {
    const reviewDiv = document.createElement('div')
    reviewDiv.classList.add('review')

    //Author
    const author = document.createElement('strong')
    author.textContent = review.author || 'Anonym'
    reviewDiv.appendChild(author)

    //Rating
    const ratingText = document.createTextNode(` - ${review.rating}/5`)
    reviewDiv.appendChild(ratingText)

    //Review comment (Content in a paragraph)
    const commentPara = document.createElement('p')
    commentPara.textContent = review.comment
    reviewDiv.appendChild(commentPara)

    //Adding review to the list
    reviewsList.appendChild(reviewDiv)
  })
}

//POST DOM-load: Getting all Reviews and Eventlisteners when page has loaded
document.addEventListener('DOMContentLoaded', () => {
  loadReviews(movieId)

  //I need my buttons declared locally, but I could also declare them outside to call on them in DOMcontentLoaded. Maybe next time
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
