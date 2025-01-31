import fetch from 'node-fetch'

function toReviewObject(apiObject) {
  return {
    id: apiObject.id,
    ...apiObject.attributes,
  }
}

const cmsAdapter = {
  loadReviewsForMovie: async (movieId, page, pageSize) => {
    let apiUrl = `https://plankton-app-xhkom.ondigitalocean.app/api/reviews?filters[movie]=${movieId}&pagination[page]=${page}`

    if (pageSize) {
      apiUrl += `&pagination[pageSize]=${pageSize}`
    }

    const res = await fetch(apiUrl)
    const payload = await res.json()

    return {
      data: payload.data.map(toReviewObject),
      meta: payload.meta,
    }
  },
}

export default cmsAdapter
