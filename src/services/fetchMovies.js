import fetch from 'node-fetch'

function toMovieObject(apiObject) {
  return {
    id: apiObject.id,
    ...apiObject.attributes,
  }
}

export async function loadMovies() {
  const res = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/movies')
  const payload = await res.json()
  return payload.data.map(toMovieObject)
}

export async function loadMovie(id) {
  const res = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/movies/' + id)
  const payload = await res.json()
  return toMovieObject(payload.data)
}

export async function filmExists(movieId) {
  const movies = await loadMovies()
  return movies.some((movie) => movie.id.toString() === movieId.toString())
}

/*
Denna fil används för att hämta filmer från det ext plankton API:et, 
de bearbetas så att de går att använda i applikationen. 

function toMovieOIbj omvandlar och inkluderar de attribut
som finns i apiObject.attributes
loadMovies() anv fetch för att göra en GET req till plankton API:et och
när svaret kommer tillbax i JSON format konverteras det via payload till
js obj. Varje film mappas genom toMovieObj() för att omvandlas och 
slutligen returneras en lista på filmer i NYTT format.

loadMovie(id) Hämtar detaljerad info om en film baserat på id
GET req görs till plankton API:et +id 
JSON svaret omvandlas till js objekt och återvänder
omformat efter toMovieObj()

filmExists(movieId)
Denna function kontrollerar om en film med ett särskilt movieID finns
i databasen. loadMovies() HÄMTAR alla filmer och sen kontrolleras
det om filmen med aktuellt movieId som skickats in, finns.
Om finns, så returneras True.
Om ej, så False. 
*/
