/* ============================================================
   CRIPTICILLO — LÓGICA DEL JUEGO
   ============================================================ */

(function () {
  "use strict";

  const FECHA_HOY = obtenerFechaDeHoyEnEspana();

  // Solo los puzzles cuya fecha ya ha llegado (hoy o antes) son jugables.
  const puzzlesJugables = ordenarPuzzlesPorFecha(
    CRIPTICILLO_PUZZLES.filter((p) => p.fecha <= FECHA_HOY)
  );

  // Estado de la partida en curso
  let estado = {
    puzzle: null,
    longitudes: [],
    letrasReveladas: new Set(), // índices (globales, sin contar espacios) fijados
    tipoAyudaAbierta: null,
  };

  /* ---------------------- Referencias al DOM ---------------------- */

  const pantallaInicio = document.getElementById("pantalla-inicio");
  const pantallaJuego = document.getElementById("pantalla-juego");
  const pantallaFelicidades = document.getElementById("pantalla-felicidades");

  const textoFechaHoy = document.getElementById("texto-fecha-hoy");
  const textoFechaPuzzle = document.getElementById("texto-fecha-puzzle");
  const textoPista = document.getElementById("texto-pista");
  const contenedorCasillas = document.getElementById("contenedor-casillas");

  const botonPistas = document.getElementById("boton-pistas");
  const listaPistas = document.getElementById("lista-pistas");
  const burbujaAyuda = document.getElementById("burbuja-ayuda");
  const textoBurbujaAyuda = document.getElementById("texto-burbuja-ayuda");

  const textoSolucionFinal = document.getElementById("texto-solucion-final");
  const contenedorDiasAnteriores = document.getElementById(
    "contenedor-dias-anteriores"
  );
  const listaDiasAnteriores = document.getElementById("lista-dias-anteriores");

  /* ---------------------- Utilidades de pantalla ---------------------- */

  function mostrarPantalla(pantalla) {
    [pantallaInicio, pantallaJuego, pantallaFelicidades].forEach((p) =>
      p.classList.add("oculto")
    );
    pantalla.classList.remove("oculto");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function formatearFechaLegible(fechaISO) {
    const [anio, mes, dia] = fechaISO.split("-").map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    const texto = new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(fecha);
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  textoFechaHoy.textContent = formatearFechaLegible(FECHA_HOY);

  /* ---------------------- Cargar un puzzle ---------------------- */

  function cargarPuzzle(fecha) {
    const puzzle = puzzlesJugables.find((p) => p.fecha === fecha);
    if (!puzzle) return;

    estado = {
      puzzle,
      longitudes: calcularLongitudesPalabras(puzzle.solucion),
      letrasReveladas: new Set(),
      tipoAyudaAbierta: null,
    };

    textoFechaPuzzle.textContent = formatearFechaLegible(puzzle.fecha);
    listaPistas.classList.add("oculto");
    burbujaAyuda.classList.add("oculto");

    renderizarPista();
    renderizarCasillas();
    mostrarPantalla(pantallaJuego);

    // Pone el foco en la primera casilla para escribir más rápido
    const primeraCasilla = contenedorCasillas.querySelector(".casilla");
    if (primeraCasilla) primeraCasilla.focus();
  }

  /* ---------------------- Renderizar la pista con subrayados ---------------------- */

  function renderizarPista() {
    const puzzle = estado.puzzle;
    textoPista.innerHTML = construirHtmlPistaConMarcas(
      puzzle.pista,
      estado.longitudes,
      puzzle.pistas
    );
  }

  /* ---------------------- Renderizar las casillas ---------------------- */

  function renderizarCasillas() {
    contenedorCasillas.innerHTML = "";
    let indiceGlobal = 0;

    estado.longitudes.forEach((longitud) => {
      const grupo = document.createElement("div");
      grupo.className = "grupo-palabra";

      for (let i = 0; i < longitud; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.className = "casilla";
        input.dataset.indice = String(indiceGlobal);
        input.autocomplete = "off";
        input.inputMode = "text";
        input.addEventListener("input", manejarEscrituraCasilla);
        input.addEventListener("keydown", manejarTeclaCasilla);
        grupo.appendChild(input);
        indiceGlobal++;
      }
      contenedorCasillas.appendChild(grupo);
    });
  }

  function todasLasCasillas() {
    return Array.from(contenedorCasillas.querySelectorAll(".casilla"));
  }

  function manejarEscrituraCasilla(evento) {
    const input = evento.target;
    input.value = input.value.toUpperCase().replace(/[^A-ZÑÁÉÍÓÚÜ]/g, "");
    if (input.value) {
      const casillas = todasLasCasillas();
      const posicion = casillas.indexOf(input);
      const siguiente = casillas[posicion + 1];
      if (siguiente && !siguiente.disabled) siguiente.focus();
    }
  }

  function manejarTeclaCasilla(evento) {
    const input = evento.target;
    const casillas = todasLasCasillas();
    const posicion = casillas.indexOf(input);

    if (evento.key === "Backspace" && !input.value) {
      const anterior = casillas[posicion - 1];
      if (anterior && !anterior.disabled) {
        anterior.focus();
      }
    } else if (evento.key === "ArrowLeft") {
      const anterior = casillas[posicion - 1];
      if (anterior) anterior.focus();
    } else if (evento.key === "ArrowRight") {
      const siguiente = casillas[posicion + 1];
      if (siguiente) siguiente.focus();
    } else if (evento.key === "Enter") {
      comprobarRespuesta();
    }
  }

  function comprobarRespuesta() {
    const casillas = todasLasCasillas();
    const letras = casillas.map((c) => c.value || "");

    if (letras.some((l) => !l)) return; // faltan casillas por rellenar

    if (esRespuestaCorrecta(letras, estado.puzzle.solucion)) {
      mostrarFelicidades();
    } else {
      casillas.forEach((c) => {
        c.classList.remove("casilla--sacudida");
        // Forzar reinicio de la animación
        void c.offsetWidth;
        c.classList.add("casilla--sacudida");
      });
    }
  }

  document.getElementById("boton-enviar").addEventListener("click", comprobarRespuesta);

  /* ---------------------- Menú de pistas ---------------------- */

  botonPistas.addEventListener("click", () => {
    listaPistas.classList.toggle("oculto");
  });

  document.addEventListener("click", (evento) => {
    if (
      !listaPistas.contains(evento.target) &&
      evento.target !== botonPistas &&
      !listaPistas.classList.contains("oculto")
    ) {
      listaPistas.classList.add("oculto");
    }
  });

  listaPistas.querySelectorAll(".menu-pistas__opcion").forEach((opcion) => {
    opcion.addEventListener("click", () => {
      const tipo = opcion.dataset.tipo;
      listaPistas.classList.add("oculto");
      if (tipo === "letra") {
        revelarLetraAleatoria();
      } else {
        activarMarca(tipo);
      }
    });
  });

  function activarMarca(tipo) {
    const info = estado.puzzle.pistas && estado.puzzle.pistas[tipo];
    if (!info || !info.fragmentos || !info.fragmentos.length) return;

    const spans = textoPista.querySelectorAll(`[data-marca="${tipo}"]`);
    spans.forEach((span) => span.classList.add("marca--activa"));

    estado.tipoAyudaAbierta = tipo;
    textoBurbujaAyuda.textContent = info.ayuda || "";
    burbujaAyuda.classList.remove("oculto");
  }

  document.getElementById("cerrar-burbuja-ayuda").addEventListener("click", () => {
    burbujaAyuda.classList.add("oculto");
    estado.tipoAyudaAbierta = null;
  });

  function revelarLetraAleatoria() {
    const casillas = todasLasCasillas();
    const solucionPlana = Array.from(
      estado.puzzle.solucion.replace(/\s+/g, "")
    );
    const disponibles = casillas
      .map((c, i) => i)
      .filter((i) => !estado.letrasReveladas.has(i));

    if (disponibles.length === 0) return;

    const indice =
      disponibles[Math.floor(Math.random() * disponibles.length)];
    estado.letrasReveladas.add(indice);

    const casilla = casillas[indice];
    casilla.value = solucionPlana[indice].toUpperCase();
    casilla.disabled = true;
  }

  /* ---------------------- Pantalla de felicidades ---------------------- */

  function mostrarFelicidades() {
    textoSolucionFinal.textContent = estado.puzzle.solucion.toUpperCase();
    contenedorDiasAnteriores.classList.add("oculto");
    mostrarPantalla(pantallaFelicidades);
  }

  document
    .getElementById("boton-jugar-anteriores")
    .addEventListener("click", () => {
      listaDiasAnteriores.innerHTML = "";
      puzzlesJugables.forEach((p) => {
        const boton = document.createElement("button");
        boton.className = "dias-anteriores__dia";
        boton.textContent = formatearFechaCorta(p.fecha);
        boton.addEventListener("click", () => cargarPuzzle(p.fecha));
        listaDiasAnteriores.appendChild(boton);
      });
      contenedorDiasAnteriores.classList.remove("oculto");
    });

  function formatearFechaCorta(fechaISO) {
    const [anio, mes, dia] = fechaISO.split("-").map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
    }).format(fecha);
  }

  /* ---------------------- Navegación general ---------------------- */

  document.getElementById("boton-jugar").addEventListener("click", () => {
    cargarPuzzle(FECHA_HOY);
  });

  document
    .getElementById("boton-volver-inicio")
    .addEventListener("click", () => mostrarPantalla(pantallaInicio));

  document.querySelectorAll("[data-cerrar]").forEach((boton) => {
    boton.addEventListener("click", () => {
      document.getElementById(boton.dataset.cerrar).classList.add("oculto");
    });
  });

  document
    .getElementById("boton-como-se-juega")
    .addEventListener("click", () => {
      document
        .getElementById("superposicion-como-se-juega")
        .classList.remove("oculto");
    });

  document
    .getElementById("boton-ayuda-juego")
    .addEventListener("click", () => {
      document
        .getElementById("superposicion-como-se-juega")
        .classList.remove("oculto");
    });

  /* ---------------------- Mezclador ---------------------- */

  const botonMezclador = document.getElementById("boton-mezclador");
  const superposicionMezclador = document.getElementById(
    "superposicion-mezclador"
  );
  const entradaMezclador = document.getElementById("mezclador-entrada");
  const zonaMezclador = document.getElementById("mezclador-zona");
  const botonReorganizar = document.getElementById("mezclador-reorganizar");

  botonMezclador.addEventListener("click", () => {
    superposicionMezclador.classList.remove("oculto");
  });

  entradaMezclador.addEventListener("input", () => {
    renderizarFichas(Array.from(entradaMezclador.value.toUpperCase()));
  });

  botonReorganizar.addEventListener("click", () => {
    const letras = Array.from(zonaMezclador.querySelectorAll(".ficha-letra")).map(
      (f) => f.textContent
    );
    for (let i = letras.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letras[i], letras[j]] = [letras[j], letras[i]];
    }
    renderizarFichas(letras);
  });

  function renderizarFichas(letras) {
    zonaMezclador.innerHTML = "";
    letras
      .filter((l) => l.trim())
      .forEach((letra) => {
        const ficha = document.createElement("div");
        ficha.className = "ficha-letra";
        ficha.textContent = letra;
        ficha.addEventListener("pointerdown", iniciarArrastreFicha);
        zonaMezclador.appendChild(ficha);
      });
  }

  function iniciarArrastreFicha(eventoInicial) {
    const original = eventoInicial.currentTarget;
    const letra = original.textContent;

    const clon = document.createElement("div");
    clon.className = "ficha-letra arrastrando";
    clon.textContent = letra;
    document.body.appendChild(clon);

    posicionarClon(clon, eventoInicial.clientX, eventoInicial.clientY);

    function mover(evento) {
      posicionarClon(clon, evento.clientX, evento.clientY);
    }

    function soltar(evento) {
      document.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerup", soltar);
      clon.remove();

      clon.style.display = "none";
      const elementoDebajo = document.elementFromPoint(
        evento.clientX,
        evento.clientY
      );
      if (elementoDebajo && elementoDebajo.classList.contains("casilla") && !elementoDebajo.disabled) {
        elementoDebajo.value = letra;
        elementoDebajo.dispatchEvent(new Event("input"));
      }
    }

    document.addEventListener("pointermove", mover);
    document.addEventListener("pointerup", soltar);
  }

  function posicionarClon(clon, x, y) {
    clon.style.left = x - 19 + "px";
    clon.style.top = y - 19 + "px";
  }

  /* ---------------------- Cerrar pop-ups pulsando fuera ---------------------- */

  document.querySelectorAll(".superposicion").forEach((sup) => {
    sup.addEventListener("click", (evento) => {
      if (evento.target === sup) sup.classList.add("oculto");
    });
  });
})();
