// Herramientas de texto que usan tanto el servidor como el navegador.
// Van en un archivo aparte de palabras.ts para que el navegador pueda
// usarlas sin llevarse la lista de palabras.

// Pasa una palabra a mayúsculas y le quita las tildes, pero deja la Ñ.
// "Árbol" → "ARBOL", "montaña" → "MONTAÑA".
export function normalizar(texto: string): string {
  return texto
    .toUpperCase()
    .normalize("NFD") // separa cada letra de su tilde: Á → A + ´, Ñ → N + ~
    .replace(/[̀-ͯ]/g, (marca) => (marca === "̃" ? marca : "")) // borra todas menos la ~
    .normalize("NFC"); // vuelve a juntar N + ~ → Ñ
}

// ¿Es una sola letra válida del juego? (A–Z o Ñ, ya normalizada)
export function esLetra(texto: string): boolean {
  return /^[A-ZÑ]$/.test(texto);
}
