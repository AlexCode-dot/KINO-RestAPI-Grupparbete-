;(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')

        // If form is valid the code proceeds to store member on local storage
        if (form.checkValidity()) {
          event.preventDefault()

          //Form data:
          const firstName = document.getElementById('register_firstName').value.trim()
          const lastName = document.getElementById('register_lastName').value.trim()
          const email = document.getElementById('register_email').value.trim()
          const username = document.getElementById('register_username').value.trim()
          const password = document.getElementById('register_password').value.trim()
          const acceptedTerms = document.getElementById('invalidCheck').checked

          const userData = {
            firstName,
            lastName,
            email,
            username,
            password,
            acceptedTerms,
          }

          let storedMembers = JSON.parse(localStorage.getItem('members')) || []
          storedMembers.push(userData)
          localStorage.setItem('members', JSON.stringify(storedMembers))
          form.reset()
          form.classList.remove('was-validated')
          const strengthFeedback = document.getElementById('passwordStrength')
          strengthFeedback.className = ''
          strengthFeedback.textContent = ''
          const passwordContainer = document.getElementById('password_Container')
          passwordContainer.classList.remove('was-validated')
        }
      },
      false
    )
  })
})()

//To toggle the password field so that the text becomes visible/hidden
const togglePassword = document.getElementById('togglePassword')
togglePassword.addEventListener('click', () => {
  const inputField = document.getElementById('register_password')
  if (inputField.type === 'password') {
    inputField.type = 'text'
  } else {
    inputField.type = 'password'
  }
})

//Function to evaluate and check the strength of the chosen password
function checkPasswordStrength(password) {
  let strength = 0
  if (password.length >= 8) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[\W_]/.test(password)) strength += 1

  const levels = ['Otillräckligt', 'Svagt', 'Mellan', 'Starkt']
  return {
    level: levels[strength - 1] || 'Otillräckligt',
  }
}

//event listener to monitor password strength and give user feedback
document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('register_password')
  const strengthFeedback = document.getElementById('passwordStrength')
  const passwordContainer = document.getElementById('password_Container')

  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value.trim()
    const strength = checkPasswordStrength(password)

    if (password === '') {
      strengthFeedback.textContent = ''
      strengthFeedback.className = ''
      passwordContainer.classList.remove('was-validated')
      return
    }

    strengthFeedback.textContent = 'Styrka: ' + strength.level
    strengthFeedback.className = ''

    if (strength.level === 'Otillräckligt' || strength.level === 'Svagt') {
      strengthFeedback.classList.add('passwordStrength-weakest')
      passwordContainer.classList.add('was-validated')
    } else if (strength.level === 'Mellan') {
      strengthFeedback.classList.add('passwordStrength-medium')
      passwordContainer.classList.add('was-validated')
    } else if (strength.level === 'Starkt') {
      strengthFeedback.classList.add('passwordStrength-strong')
      passwordContainer.classList.add('was-validated')
    }
  })
})
