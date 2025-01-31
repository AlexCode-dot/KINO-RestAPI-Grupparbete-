import renderPage from './renderPage.js'

export function renderErrorPage(response, status, errorType, message) {
  response.status(status)
  renderPage(response, 'error', {
    status,
    errorType,
    message,
  })
}
