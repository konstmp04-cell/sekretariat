import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative Pfade statt absoluter: Auf GitHub Pages liegt die Seite in einem
  // Unterordner (/Projekt-Lernseite/), nicht auf der Domainwurzel. Mit '/'
  // würde der Browser die Skripte an der falschen Stelle suchen. './' geht
  // sowohl dort als auch lokal.
  base: './',
  plugins: [react(), tailwindcss()],
})
