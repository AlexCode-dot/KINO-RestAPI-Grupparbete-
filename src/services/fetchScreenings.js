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
  loadScreeningForMovie: async (movieId) => {
    const now = new Date()
    const fiveDaysLater = new Date(now)
    fiveDaysLater.setDate(now.getDate() + 5)

    const res = await fetch(
      `https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie&filters[movie]=${movieId}
      &filters[start_time][$gte]=${now.toISOString()}
      &filters[start_time][$lte]=${fiveDaysLater.toISOString()}
      &pagination[limit]=10`
    )
    const payload = await res.json()
    return {
      data: payload.data.map(toScreeningObject),
      meta: payload.meta,
    }
  },
}

export default screeningAdapter
