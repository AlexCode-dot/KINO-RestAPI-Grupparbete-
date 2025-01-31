import fetch from 'node-fetch'

//Hämtar recensioner för en viss film eller de senaste recensionerna generellt

function toReviewObject(apiObject) {
  return {
    id: apiObject.id,
    ...apiObject.attributes,
  }
}

const cmsAdapter = {
  loadReviewsForMovie: async (movieId, page = 1, pageSize = 5) => {
    let apiUrl = `https://plankton-app-xhkom.ondigitalocean.app/api/reviews?pagination[page]=${page}&pagination[pageSize]=${pageSize}`

    if (movieId) {
      apiUrl += `&filters[movie]=${movieId}`
    }

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`)

    const payload = await res.json()

    return {
      data: payload.data.map(toReviewObject),
      meta: payload.meta,
    }
  },
}

export default cmsAdapter
