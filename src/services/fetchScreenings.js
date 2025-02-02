import fetch from 'node-fetch'

function toScreeningObject(apiObjekt) {
  return {
    id: apiObjekt.id,
    ...apiObjekt.attributes,
    movie: apiObjekt.attributes.movie.data
      ? {
          id: apiObjekt.attributes.movie.data.id,
          ...apiObjekt.attributes.movie.data.attributes,
        }
      : null,
  }
}

const screeningAdapter = {
  loadScreeningsForMovie: async (movieId) => {
    const res = await fetch(
      `https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie&filters[movie]=${movieId}`
    )
    const payload = await res.json()
    console.log('API-Response:', movieId, payload)
    return {
      data: payload.data.map(toScreeningObject),
      meta: payload.meta,
    }
  },
}

export default screeningAdapter
