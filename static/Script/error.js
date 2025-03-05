export async function errorFeedback(error, container) {
  if (!container) return

  container.textContent = ''
  const errorMessage = document.createElement('p')
  errorMessage.textContent = error.message

  container.appendChild(errorMessage)
}
