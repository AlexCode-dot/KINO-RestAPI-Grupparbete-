import { marked } from 'marked'
import { getMenu, getFrontPageContent } from '../services/loadJson.js'

export default async function renderPage(response, page, additionalData = {}) {
  const menu = await getMenu()
  const { frontPageContent, frontPageImages } = await getFrontPageContent()

  if (additionalData.movie && additionalData.movie.intro) {
    additionalData.movie.intro = marked(additionalData.movie.intro)
  }

  response.render(page, {
    menuItems: menu.map((item) => {
      return {
        label: item.label,
        link: item.link,
        active: item.id == page,
      }
    }),
    frontPageContent,
    frontPageImages,
    ...additionalData,
  })
}

/*
Här renderas en hel vy (HTML sida) baserat på olika typer av 
specifik data. 

renderPage tar 3 params:
response: Express response-objektet som används för att 
skicka tillbaka svaret till klienten.

page: Namnet på den vy (EJS-sidan) som ska renderas 
(t.ex. "hem", "filmer", "error").
additionalData (valfri): 
Extra data som kan skickas till vyn, 
t.ex. en lista av filmer eller detaljer för en specifik film.

getMenu() och getFrontPageContent(): 
hämtar in externa resurser fär startsidan.

marked(): Används för att konvertera Markdown-formaterad text 
till HTML. Om en film har en introduktion i Markdown-format 
så konverteras texten innan dem skickas till vyn.

response.render() metoden renderar en vy med den angivna datan, 
i detta fall= page-sidan och skickar med:
menuItems: En lista över alla menyalternativ
(med etikett, länk och om det ska vara markerat som aktivt).
frontPageContent och frontPageImages: Innehåll och bilder för startsidan.
additionalData: Extra data som kan innehålla information om specifika sidor, 
som t.ex. filmer, event eller användarinformation.

*/
