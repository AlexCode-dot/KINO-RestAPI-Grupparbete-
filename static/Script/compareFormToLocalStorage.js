const loginForm = document.querySelector('form')

loginForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const usernameInput = document.querySelector('#exampleInputEmail1')
  const passwordInput = document.querySelector('#exampleInputPassword1')

  const enteredUsername = usernameInput.value
  const enteredPassword = passwordInput.value

  const storedMembers = JSON.parse(localStorage.getItem('members')) || []

  const matchedUser = storedMembers.find(
    (user) => (user.username === enteredUsername || user.email === enteredUsername) && user.password === enteredPassword
  )

  if (matchedUser) {
    localStorage.setItem('loggedInUser', JSON.stringify(matchedUser))
    document.getElementById('loginMessage').style.display = 'none'

    const myModal = new bootstrap.Modal(document.getElementById('loggedInModal'))
    myModal.show()
  } else {
    document.getElementById('loginMessage').style.display = 'block'
  }
})
