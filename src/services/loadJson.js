import fs from 'fs/promises'

export async function getMenu() {
  const content = await getFrontPageContent()
  const menuData = content.frontPageContent.header.menu

  const menu = menuData.map((item) => ({
    label: item,
    link: item.toLowerCase() === 'hem' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '')}`,
    id: item.toLowerCase().replace(/\s+/g, ''),
  }))

  return menu
}

export async function getFrontPageContent() {
  const content = await fs.readFile('./static/json/FrontPage-content.json', 'utf-8')
  const images = await fs.readFile('./static/json/FrontPage-images.json', 'utf-8')
  return {
    frontPageContent: JSON.parse(content),
    frontPageImages: JSON.parse(images),
  }
}

/*
Denna fil hanterar lokala JSON-filer. (som ligger i static/json)
Den bearbetar data från just dessa filer

getMenu() Hämtar allt frontpage content. Den implementerar datan
om menyn från frontPageContent.header.menu där varje objekt i menyn
är en sträng. 

Den mappar varje menypost och skapar en lista med:
LABEL menyns text
LINK Länk som menyalternativet ska leda till
ID Unikt id för menyposten 

innehåll hämtas till startsidan via 2 JSON filer
FrontPage-content.json: Innehåller t.ex. texter, menyer, etc.
FrontPage-images.json: Innehåller data om bilder som ska visas på startsidan.
*/
