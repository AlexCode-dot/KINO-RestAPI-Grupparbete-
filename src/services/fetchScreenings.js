import fetch from 'node-fetch'
import { getScreeningsForNextFiveDays } from './screeningsService.js'

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
  loadScreeningsForDate: async (formattedDate) => {
    const res = await fetch(
      `https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie&filters[start_time][$gte]=${formattedDate}T00:00:00.000Z&filters[start_time][$lt]=${formattedDate}T23:59:59.999Z`
    )
    const payload = await res.json()
    return {
      data: payload.data.map(toScreeningObject),
      meta: payload.meta,
    }
  },

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
  loadAllScreenings: async () => {
    const res = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/screenings?populate=movie`)
    const payload = await res.json()
    return {
      data: payload.data.map(toScreeningObject),
      meta: payload.meta,
    }
  },
  loadScreeningsForOneMovie: async (id, page, pageSize) => {
    let url = `https://plankton-app-xhkom.ondigitalocean.app/api/screenings?filters[movie]=${id}&pagination[page]=${page}`

    if (pageSize) {
      url += `&pagination[pageSize]=${pageSize}`
    }

    const resp = await fetch(url)
    const payload = await resp.json()

    return payload
  },
}

export default screeningAdapter
