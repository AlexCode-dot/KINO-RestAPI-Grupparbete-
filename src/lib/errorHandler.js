import renderPage from './renderPage.js'

export function renderErrorPage(response, status, errorType, message) {
  response.status(status)
  renderPage(response, 'error', {
    status,
    errorType,
    message,
  })
}

/*
renderErrorPage tar 4 params
- response ) Detta är Express response-objektet 
som används för att skicka data till klienten (webbläsaren)
- status ) HTTP-statuskod 404 är för "not found"
500 är för "server error"
- errorType ) En sträng som beskriver typen av fel, typ att "sidan
ej kunde hittas"
- message ) Meddelande med ytterligare förklaring om felet

response.status(status): 
Sätter HTTP-statuskoden för svaret

renderPage: Anropar funktionen renderPage, 
som renderar en vy (HTML-sida) med specifika data. 
Här skickar vi med: 'error': Det här är namnet på den vy (EJS-sidan) 
som ska renderas för att visa ett felmeddelande.
Data: Vi skickar med data som används på fel-sidan: statuskoden, feltypen och meddelandet.
*/
