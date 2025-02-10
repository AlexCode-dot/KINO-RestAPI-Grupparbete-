import fetch from 'node-fetch'

export async function getExtraReviews(movieId) {
  const movieurl = `https://plankton-app-xhkom.ondigitalocean.app/api/movies/${movieId}`
  console.log('Fetching movie with ID:', movieId)
  console.log(movieurl)

  const response = await fetch(movieurl)
  const data = await response.json()
  const debug = false
  if (!response.ok) {
    console.error(`Error fetching data from API: ${data.message}`)
  }
  const imdb = data.data.attributes.imdbId

  if (debug === true) {
    console.log('Fetched movies data:', data)
    console.log('getting imdb id:', data.data.attributes.imdbId)
    console.log(`stored imdb: ${imdb}`)
  }
  const apiKey = 'apikey=a159d0a'
  const externalApiUrl = `https://www.omdbapi.com/?${apiKey}&i=${imdb}`
  const externalApiResponse = await fetch(externalApiUrl)
  const omdb = await externalApiResponse.json()

  const extraReview = omdb.imdbRating
  const InternetMovieDatabase = omdb.Ratings[0]
  const Metacritic = omdb.Ratings[1]
  const Rottentomatos = omdb.Ratings[2]
  const Metascore = omdb.Metascore
  const runTime = omdb.Runtime

  if (debug === true) console.log('the response data', omdb)
  console.log(externalApiUrl)
  console.log('Runtime', runTime)
  console.log('Internet Movie Database', InternetMovieDatabase)
  console.log('Metacritic', Metacritic)
  console.log('Rotten Tomatoes', Rottentomatos)
  console.log('this is what omdb is sending', extraReview)
  return extraReview
}

export async function getTitle(movieId) {
  const movieurl = `https://plankton-app-xhkom.ondigitalocean.app/api/movies/${movieId}`
  console.log('Fetching movie with ID:', movieId)
  console.log(movieurl)
  const response = await fetch(movieurl)
  const data = await response.json()

  if (!response.ok) {
    console.error(`Error fetching data from API: ${data.message}`)
    // return null
  }

  const title = data.data.attributes.title
  console.log(`stored title: ${title}`)

  return title
}
