import fetch from 'node-fetch'

function toReviewObject(apiObject) {
  return {
    id: apiObject.id,
    ...apiObject.attributes,
  }
}

const cmsAdapter = {
  loadReviewsForMovie: async (movieId, page) => {
    const pageSize = await getReviewsPageSize(movieId, page)
    const res = await fetch(
      `https://plankton-app-xhkom.ondigitalocean.app/api/reviews?filters[movie]=${movieId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    )
    const payload = await res.json()
    return {
      data: payload.data.map(toReviewObject),
      meta: payload.meta,
    }
  },
}

export async function getReviewsPageSize(movieId, page) {
  const res = await fetch(
    `https://plankton-app-xhkom.ondigitalocean.app/api/reviews?filters[movie]=${movieId}&pagination[page]=${page}`
  )
  const payload = await res.json()
  return payload.meta.pagination.pageSize
}

export default cmsAdapter
