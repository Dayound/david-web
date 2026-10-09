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

// verde: letra en su sitio · amarillo: está, pero en otro sitio · gris: no está
export type Color = "verde" | "amarillo" | "gris";

// Compara un intento con la palabra, letra a letra.
// Las letras repetidas cuentan bien: si la palabra tiene una sola A y el
// intento tiene dos, solo una se pinta (primero las verdes, luego las amarillas).
export function colorear(intento: string, palabra: string): Color[] {
  const colores: Color[] = Array(palabra.length).fill("gris");
  const quedan: Record<string, number> = {}; // letras de la palabra aún sin emparejar

  // 1ª vuelta: las que están en su sitio.
  for (let i = 0; i < palabra.length; i++) {
    if (intento[i] === palabra[i]) colores[i] = "verde";
    else quedan[palabra[i]] = (quedan[palabra[i]] ?? 0) + 1;
  }
  // 2ª vuelta: las que están, pero en otro sitio.
  for (let i = 0; i < palabra.length; i++) {
    if (colores[i] !== "verde" && quedan[intento[i]] > 0) {
      colores[i] = "amarillo";
      quedan[intento[i]]--;
    }
  }
  return colores;
}
