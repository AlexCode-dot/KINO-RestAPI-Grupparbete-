## Steg-för-steg guide för att nergradera Tailwind CSS v4 till v3

### Steg 1: Avinstallera gamla paket

```bash
npm uninstall tailwindcss @tailwindcss/postcss
```

### Steg 2: Installera nya paket

```bash
npm install tailwindcss@3.4.14 postcss@8.4.47 autoprefixer@10.4.21 postcss-cli@11.0.0
```

### Steg 3: Uppdatera postcss.config.cjs

Ersätt innehållet i `postcss.config.cjs` med:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Steg 4: Uppdatera tailwind.config.js

Ersätt innehållet i `tailwind.config.js` med:

```javascript
module.exports = {
  content: ['./templates/**/*.{html,ejs}'],
  theme: { extend: {} },
  plugins: [],
}
```

### Steg 5: Ta bort gammal CSS-fil

Radera filen `static/styles/tailwind.css`

### Steg 6: Bygg ny CSS

Kör följande kommando i terminalen:

```bash
npm run build:css
```

---

Answer from Perplexity: pplx.ai/share
