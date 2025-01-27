import fs from 'fs/promises'

export async function getMenu() {
  const content = await getFrontPageContent()
  const menuData = content.frontPageContent.header.menu

  const menu = menuData.map((item) => ({
    label: item,
    link: item.toLowerCase() === 'filmer' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '')}`,
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
