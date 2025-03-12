import { fetchTopRatedMovies } from './fetchTopRated.js'
import { errorFeedback } from './error.js'
import { createMovies, displayEmptyMessage } from './uiRenderer.js'

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname !== '/') {
    return
  }
  const moviesContainer = document.querySelector('.top-rated__container')

  try {
    const topRatedMovies = await fetchTopRatedMovies()

    if (topRatedMovies.length === 0) {
      displayEmptyMessage('Inga filmer hittades.', moviesContainer)
    } else {
      createMovies(topRatedMovies, moviesContainer)
    }
  } catch (error) {
    errorFeedback(error, moviesContainer)
  }
})

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/profil') {
    localStorage.setItem('isLoggedIn', 'true')
  }

  const loginNavItem = document.querySelector(
    '.header__nav-list a[href="/loggain"], .header__nav-list a[href="/profil"]'
  )

  if (localStorage.getItem('isLoggedIn') === 'true' && loginNavItem) {
    loginNavItem.textContent = 'DIN PROFIL'
    loginNavItem.setAttribute('href', '/profil')

    const profileIcon = document.createElement('span')
    profileIcon.classList.add('profile-icon')
    loginNavItem.insertBefore(profileIcon, loginNavItem.firstChild)
  }

  // Uppdatera aktivt menyobjekt dynamiskt
  document.querySelectorAll('.header__nav-item').forEach((item) => {
    item.classList.remove('menu-active')
    if (item.querySelector(`a[href="${window.location.pathname}"]`)) {
      item.classList.add('menu-active')
    }
  })
})
