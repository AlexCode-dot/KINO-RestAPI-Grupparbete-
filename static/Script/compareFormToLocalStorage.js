const loginForm = document.querySelector('form')
loginForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const usernameInput = document.querySelector('#exampleInputEmail1')
  const passwordInput = document.querySelector('#exampleInputPassword1')

  const enteredUsername = document.querySelector('#exampleInputEmail1').value
  const enteredPassword = document.querySelector('#exampleInputPassword1').value

  const storedUsername = localStorage.getItem('username')
  const storedPassword = localStorage.getItem('password')

  const storedMembers = JSON.parse(localStorage.getItem('members')) || []

  const matchedUser =
    storedMembers.find((user) => user.username === enteredUsername && user.password === enteredPassword) ||
    user.email === enteredUser

  if (matchedUser) {
    window.location.href = '/profile'
  } else if (enteredUsername !== '' && enteredPassword !== '' && !matchedUser) {
    alert('Wrong username or password')
  } else if (enteredUsername === '' && enteredPassword === '') {
    return
  }
})
