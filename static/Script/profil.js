const username = document.querySelector('.username')
const mail = document.querySelector('.email')

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

username.textContent = loggedInUser.username
mail.textContent = loggedInUser.email

const logoutButton = document.querySelector('.logout')
if (logoutButton) {
  logoutButton.addEventListener('click', (event) => {
    event.preventDefault()
    localStorage.removeItem('isLoggedIn')
    window.location.href = '/'
  })
}
