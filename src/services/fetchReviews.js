// Detta är min routes fil för att hämta reviews från plankton API:et.
import express from 'express'
import fetch from 'node-fetch' //Fetch är inte inbyggt i Node.js så den måste importeras

/* import axios from 'axios'; //Var en tanke... då Axios gör det enklare att hämta data från externa api än med JS fetch (som förväntas i uppg), 
Fetch kräver mer kod och hantering för samma resultat. Det är inbyggt i JavaScript medan Axios måste importeras som ett extern bibliotek.
fetch hanterar inte automatisk JSON-omvandling, men Axios gör det. Å fetch kräver mer kod för felhantering */

const router = express.Router() //Router instans

//Definierar get router för "/", Hämtar recensioner m paginering
router.get('/', async (req, res) => {
  try {
    const { page = 1, movieId } = req.query
    const pageSize = 5

    let apiUrl = `https://plankton-app-xhkom.ondigitalocean.app/api/reviews?pagination[page]=${page}&pagination[pageSize]=${pageSize}`

    if (movieId) {
      apiUrl += `&filters[movie]=${movieId}`
    }

    const response = await fetch(apiUrl)

    //Eftersom fetch förväntas måste jag kontrollera om förfrågan lyckats
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    //Eftersom fetch förväntas måste jag oxå omvandla till json
    const data = await response.json()

    //samt ställa in att datan skickas som json
    res.json(data)
  } catch (error) {
    console.error('Error fetching reviews', error.message)
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})

export default router //Exporterar routern så att det kan användas i serverfilen
