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
