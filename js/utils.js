/* ============================================================
   UTILIDADES COMPARTIDAS DE CRIPTICILLO
   Este archivo NO necesita tocarse nunca. Contiene funciones
   pequeñas que usan tanto el juego como el panel de administrador.
   ============================================================ */

/**
 * Devuelve la fecha de HOY con el formato "AAAA-MM-DD",
 * calculada siempre en horario de España peninsular (Europe/Madrid),
 * sin importar dónde esté físicamente la persona que juega.
 */
function obtenerFechaDeHoyEnEspana() {
  const formateador = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  // "en-CA" da directamente el formato AAAA-MM-DD
  return formateador.format(new Date());
}

/**
 * Quita acentos/tildes y pasa a mayúsculas, para poder comparar
 * lo que escribe el jugador con la solución sin que los acentos
 * cuenten como fallo (p. ej. "CANCION" se acepta como "CANCIÓN").
 */
function normalizarTexto(texto) {
  return texto
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // elimina las marcas de acento
}

/**
 * A partir de la solución tal cual la escribió el administrador
 * (p. ej. "CANCIÓN DE CUNA"), devuelve un array con la longitud de
 * cada palabra: [7, 2, 4]. Esto es lo que se muestra entre paréntesis
 * junto a la pista y determina cuántas casillas hay por palabra.
 */
function calcularLongitudesPalabras(solucion) {
  return solucion
    .trim()
    .split(/\s+/)
    .map((palabra) => Array.from(palabra).length);
}

/**
 * Compara la solución introducida por el jugador (letra a letra, ya
 * unida en una sola cadena sin espacios) con la solución real,
 * ignorando mayúsculas/minúsculas y acentos.
 */
function esRespuestaCorrecta(letrasJugador, solucionReal) {
  const palabraJugador = normalizarTexto(letrasJugador.join(""));
  const palabraSolucion = normalizarTexto(solucionReal.replace(/\s+/g, ""));
  return palabraJugador === palabraSolucion;
}

/**
 * Convierte una fecha escrita como "dd/mm/aaaa" (la que se usa en el
 * Excel de importación) al formato interno "AAAA-MM-DD". Devuelve
 * null si el texto no tiene esa forma.
 */
function convertirFechaDDMMAAAAaISO(texto) {
  if (!texto) return null;
  const coincide = String(texto)
    .trim()
    .match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!coincide) return null;
  const [, dia, mes, anio] = coincide;
  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

/**
 * Ordena una lista de puzzles por fecha, del más antiguo al más
 * reciente.
 */
function ordenarPuzzlesPorFecha(puzzles) {
  return [...puzzles].sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
}

/**
 * Convierte texto suelto en HTML seguro (sin permitir que se cuele
 * código dentro de una pista).
 */
function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

/**
 * Busca, dentro del texto de la pista, TODAS las apariciones de los
 * fragmentos configurados para cada tipo (definición/material/
 * indicadores). Cada tipo puede tener varios fragmentos sueltos, que
 * no hace falta que estén pegados entre sí dentro de la pista.
 * Evita que dos fragmentos se solapen entre ellos.
 *
 * pistas tiene esta forma:
 *   { definicion: { fragmentos: ["texto1", "texto2"], ayuda: "..." }, ... }
 */
function encontrarMarcasEnPista(pista, pistas) {
  const textoMin = pista.toLowerCase();
  const usados = []; // rangos {inicio, fin} ya ocupados por algún fragmento
  const marcas = [];

  ["definicion", "material", "indicadores"].forEach((tipo) => {
    const info = pistas && pistas[tipo];
    const fragmentos = (info && info.fragmentos) || [];

    fragmentos.forEach((fragmentoOriginal) => {
      const fragmento = (fragmentoOriginal || "").trim();
      if (!fragmento) return;
      const fragmentoMin = fragmento.toLowerCase();

      let desde = 0;
      let indice;
      // Si el primer sitio donde aparece ya está ocupado por otro
      // fragmento, seguimos buscando la siguiente aparición.
      while ((indice = textoMin.indexOf(fragmentoMin, desde)) !== -1) {
        const fin = indice + fragmento.length;
        const solapa = usados.some((u) => indice < u.fin && fin > u.inicio);
        if (!solapa) {
          usados.push({ inicio: indice, fin });
          marcas.push({ tipo, inicio: indice, fin });
          break;
        }
        desde = indice + 1;
      }
    });
  });

  marcas.sort((a, b) => a.inicio - b.inicio);
  return marcas;
}

/**
 * Construye el HTML de la pista con cada fragmento (definición,
 * material, indicadores) envuelto en un <span> marcable, más el
 * número de letras entre paréntesis al final. Lo usan tanto el juego
 * como el panel de administrador (para la vista previa), así que
 * conviene que el resultado sea siempre idéntico en los dos sitios.
 */
function construirHtmlPistaConMarcas(pista, longitudes, pistas) {
  const marcas = encontrarMarcasEnPista(pista, pistas);

  let html = "";
  let cursor = 0;
  marcas.forEach((marca) => {
    html += escaparHtml(pista.slice(cursor, marca.inicio));
    html += `<span class="marca marca--${marca.tipo}" data-marca="${marca.tipo}">${escaparHtml(
      pista.slice(marca.inicio, marca.fin)
    )}</span>`;
    cursor = marca.fin;
  });
  html += escaparHtml(pista.slice(cursor));

  if (longitudes && longitudes.length) {
    html += ` <span class="tarjeta-pista__numero">(${longitudes.join(", ")})</span>`;
  }

  return html;
}
