/* ============================================================
   CRIPTICILLO — PANEL DE ADMINISTRADOR
   ============================================================ */

(function () {
  "use strict";

  const FECHA_HOY = obtenerFechaDeHoyEnEspana();

  // Copia de trabajo: todo lo que se edite aquí vive solo en esta
  // pestaña del navegador hasta que se descargue el archivo.
  let puzzles = JSON.parse(JSON.stringify(CRIPTICILLO_PUZZLES));

  let fechaEnEdicion = null; // si no es null, "Guardar" sustituye a ese puzzle

  /* ---------------------- Referencias al DOM ---------------------- */

  const tituloFormulario = document.getElementById("titulo-formulario");
  const campoFecha = document.getElementById("campo-fecha");
  const campoPista = document.getElementById("campo-pista");
  const campoSolucion = document.getElementById("campo-solucion");

  const camposPorTipo = {
    definicion: {
      fragmento: document.getElementById("campo-def-fragmento"),
      ayuda: document.getElementById("campo-def-ayuda"),
      aviso: document.getElementById("aviso-def"),
    },
    material: {
      fragmento: document.getElementById("campo-material-fragmento"),
      ayuda: document.getElementById("campo-material-ayuda"),
      aviso: document.getElementById("aviso-material"),
    },
    indicadores: {
      fragmento: document.getElementById("campo-indicadores-fragmento"),
      ayuda: document.getElementById("campo-indicadores-ayuda"),
      aviso: document.getElementById("aviso-indicadores"),
    },
  };

  const vistaPrevia = document.getElementById("vista-previa");
  const cuerpoTabla = document.getElementById("cuerpo-tabla-puzzles");

  /* ---------------------- Vista previa en vivo ---------------------- */

  function textoAFragmentos(texto) {
    return (texto || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function actualizarVistaPrevia() {
    const pista = campoPista.value.trim();
    const solucion = campoSolucion.value.trim();

    if (!pista || !solucion) {
      vistaPrevia.textContent = "La pista aparecerá aquí…";
      return;
    }

    const longitudes = calcularLongitudesPalabras(solucion);
    const pistasObjeto = {};
    Object.keys(camposPorTipo).forEach((tipo) => {
      const fragmentos = textoAFragmentos(camposPorTipo[tipo].fragmento.value);
      const ayuda = camposPorTipo[tipo].ayuda.value.trim();
      if (fragmentos.length) pistasObjeto[tipo] = { fragmentos, ayuda };

      // Aviso si alguno de los fragmentos escritos no aparece dentro de la pista
      const aviso = camposPorTipo[tipo].aviso;
      const noEncontrados = fragmentos.filter(
        (f) => pista.toLowerCase().indexOf(f.toLowerCase()) === -1
      );
      if (noEncontrados.length) {
        aviso.textContent =
          "⚠ No encuentro dentro de la pista: " +
          noEncontrados.map((f) => `"${f}"`).join(", ") +
          ". Ese trozo no se podrá subrayar.";
        aviso.classList.remove("oculto");
      } else {
        aviso.classList.add("oculto");
      }
    });

    vistaPrevia.innerHTML = construirHtmlPistaConMarcas(pista, longitudes, pistasObjeto);
    // En la vista previa mostramos siempre los tres colores activos,
    // para que se vea de un vistazo el resultado final.
    vistaPrevia.querySelectorAll(".marca").forEach((span) => span.classList.add("marca--activa"));
  }

  [campoPista, campoSolucion].forEach((el) =>
    el.addEventListener("input", actualizarVistaPrevia)
  );
  Object.values(camposPorTipo).forEach(({ fragmento, ayuda }) => {
    fragmento.addEventListener("input", actualizarVistaPrevia);
    ayuda.addEventListener("input", actualizarVistaPrevia);
  });

  /* ---------------------- Guardar / actualizar un puzzle ---------------------- */

  document.getElementById("boton-guardar-puzzle").addEventListener("click", () => {
    const fecha = campoFecha.value;
    const pista = campoPista.value.trim();
    const solucion = campoSolucion.value.trim().toUpperCase();

    if (!fecha || !pista || !solucion) {
      alert("Faltan datos: la fecha, la pista y la solución son obligatorias.");
      return;
    }

    const yaExiste = puzzles.some((p) => p.fecha === fecha);
    if (yaExiste && fecha !== fechaEnEdicion) {
      const continuar = confirm(
        "Ya existe un puzzle programado para ese día. ¿Quieres sobrescribirlo?"
      );
      if (!continuar) return;
    }

    const pistasObjeto = {};
    Object.keys(camposPorTipo).forEach((tipo) => {
      const fragmentos = textoAFragmentos(camposPorTipo[tipo].fragmento.value);
      const ayuda = camposPorTipo[tipo].ayuda.value.trim();
      if (fragmentos.length) pistasObjeto[tipo] = { fragmentos, ayuda };
    });

    const nuevoPuzzle = { fecha, pista, solucion, pistas: pistasObjeto };

    // Quitamos cualquier puzzle anterior con esa fecha (tanto si veníamos
    // editando como si estábamos sobrescribiendo uno existente)
    puzzles = puzzles.filter((p) => p.fecha !== fecha && p.fecha !== fechaEnEdicion);
    puzzles.push(nuevoPuzzle);
    puzzles = ordenarPuzzlesPorFecha(puzzles);

    limpiarFormulario();
    renderizarTabla();
    alert("Puzzle guardado en la lista. No olvides descargar el archivo al terminar.");
  });

  document.getElementById("boton-limpiar-formulario").addEventListener("click", limpiarFormulario);

  function limpiarFormulario() {
    fechaEnEdicion = null;
    tituloFormulario.textContent = "Nuevo puzzle";
    campoFecha.value = "";
    campoPista.value = "";
    campoSolucion.value = "";
    Object.values(camposPorTipo).forEach(({ fragmento, ayuda, aviso }) => {
      fragmento.value = "";
      ayuda.value = "";
      aviso.classList.add("oculto");
    });
    actualizarVistaPrevia();
  }

  function cargarPuzzleEnFormulario(fecha) {
    const puzzle = puzzles.find((p) => p.fecha === fecha);
    if (!puzzle) return;

    fechaEnEdicion = fecha;
    tituloFormulario.textContent = "Editando puzzle del " + fecha;
    campoFecha.value = puzzle.fecha;
    campoPista.value = puzzle.pista;
    campoSolucion.value = puzzle.solucion;

    Object.keys(camposPorTipo).forEach((tipo) => {
      const info = (puzzle.pistas && puzzle.pistas[tipo]) || {};
      camposPorTipo[tipo].fragmento.value = (info.fragmentos || []).join(", ");
      camposPorTipo[tipo].ayuda.value = info.ayuda || "";
    });

    actualizarVistaPrevia();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------------------- Tabla de puzzles ---------------------- */

  function renderizarTabla() {
    cuerpoTabla.innerHTML = "";
    ordenarPuzzlesPorFecha(puzzles).forEach((puzzle) => {
      const fila = document.createElement("tr");

      let estadoTexto = "Pasado";
      let estadoClase = "etiqueta-estado--pasado";
      if (puzzle.fecha === FECHA_HOY) {
        estadoTexto = "Hoy";
        estadoClase = "etiqueta-estado--hoy";
      } else if (puzzle.fecha > FECHA_HOY) {
        estadoTexto = "Programado";
        estadoClase = "etiqueta-estado--futuro";
      }

      fila.innerHTML = `
        <td>${puzzle.fecha}</td>
        <td><span class="etiqueta-estado ${estadoClase}">${estadoTexto}</span></td>
        <td>${escaparHtml(puzzle.pista)}</td>
        <td>${escaparHtml(puzzle.solucion)}</td>
        <td></td>
      `;

      const celdaAcciones = fila.querySelector("td:last-child");

      const botonEditar = document.createElement("button");
      botonEditar.textContent = "Editar";
      botonEditar.addEventListener("click", () => cargarPuzzleEnFormulario(puzzle.fecha));
      celdaAcciones.appendChild(botonEditar);

      celdaAcciones.appendChild(document.createTextNode(" · "));

      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "Eliminar";
      botonEliminar.addEventListener("click", () => {
        if (confirm(`¿Eliminar el puzzle del ${puzzle.fecha}? Esto no se puede deshacer.`)) {
          puzzles = puzzles.filter((p) => p.fecha !== puzzle.fecha);
          renderizarTabla();
        }
      });
      celdaAcciones.appendChild(botonEliminar);

      cuerpoTabla.appendChild(fila);
    });
  }

  /* ---------------------- Descargar el archivo actualizado ---------------------- */

  const CABECERA_ARCHIVO = `/* ============================================================================
   PUZZLES DE CRIPTICILLO
   ============================================================================

   ESTE ES EL ÚNICO ARCHIVO QUE TIENES QUE TOCAR PARA AÑADIR PUZZLES NUEVOS.
   No hace falta saber programar: puedes seguir usando el panel de
   administrador (admin.html) para generar este archivo, o editarlo a mano
   siguiendo el ejemplo de abajo.

   CÓMO ES UN PUZZLE
   ------------------
   fecha      -> "AAAA-MM-DD", el día en que se podrá jugar.
   pista      -> el texto de la pista (sin el número de letras, se calcula solo).
   solucion   -> la palabra o frase a adivinar (varias palabras separadas por espacio).
   pistas     -> definicion / material / indicadores, cada una con:
                   fragmentos -> lista de trozos exactos de la pista que se
                                 subrayan (pueden ser varios, sueltos)
                   ayuda      -> el texto que se le explica al jugador

   Este archivo se ha generado automáticamente desde el panel de
   administrador. Puedes seguir editándolo a mano si lo prefieres.
   ============================================================================ */

`;

  function generarContenidoArchivo() {
    const lista = ordenarPuzzlesPorFecha(puzzles);
    const bloques = lista.map((puzzle) => serializarPuzzle(puzzle));
    return (
      CABECERA_ARCHIVO +
      "const CRIPTICILLO_PUZZLES = [\n" +
      bloques.join(",\n") +
      ",\n];\n"
    );
  }

  function cadenaJs(texto) {
    return JSON.stringify(texto || "");
  }

  function cadenaArrayJs(lista) {
    return "[" + (lista || []).map((t) => cadenaJs(t)).join(", ") + "]";
  }

  function serializarPuzzle(puzzle) {
    const partesPistas = [];
    ["definicion", "material", "indicadores"].forEach((tipo) => {
      const info = puzzle.pistas && puzzle.pistas[tipo];
      if (!info || !info.fragmentos || !info.fragmentos.length) return;
      partesPistas.push(
        `      ${tipo}: {\n` +
          `        fragmentos: ${cadenaArrayJs(info.fragmentos)},\n` +
          `        ayuda: ${cadenaJs(info.ayuda)},\n` +
          `      },`
      );
    });

    return (
      `  {\n` +
      `    fecha: ${cadenaJs(puzzle.fecha)},\n` +
      `    pista: ${cadenaJs(puzzle.pista)},\n` +
      `    solucion: ${cadenaJs(puzzle.solucion)},\n` +
      `    pistas: {\n` +
      partesPistas.join("\n") +
      `\n    },\n` +
      `  }`
    );
  }

  document.getElementById("boton-descargar").addEventListener("click", () => {
    const contenido = generarContenidoArchivo();
    const blob = new Blob([contenido], { type: "text/javascript;charset=utf-8" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "puzzles-data.js";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
  });

  /* ---------------------- Importar desde Excel ---------------------- */

  const campoExcel = document.getElementById("campo-excel");
  const resultadoImportacion = document.getElementById("resultado-importacion");

  document.getElementById("boton-importar-excel").addEventListener("click", () => {
    const archivo = campoExcel.files && campoExcel.files[0];
    if (!archivo) {
      resultadoImportacion.innerHTML =
        '<span style="color:#a44b3f;">Primero elige un archivo .xlsx.</span>';
      return;
    }
    if (typeof XLSX === "undefined") {
      resultadoImportacion.innerHTML =
        '<span style="color:#a44b3f;">No se ha podido cargar el lector de Excel. Comprueba tu conexión a internet e inténtalo de nuevo.</span>';
      return;
    }

    const lector = new FileReader();
    lector.onload = (evento) => {
      try {
        const libro = XLSX.read(evento.target.result, {
          type: "array",
          cellDates: true,
        });
        const primeraHoja = libro.Sheets[libro.SheetNames[0]];
        const filas = XLSX.utils.sheet_to_json(primeraHoja, {
          header: 1,
          raw: false,
          dateNF: "dd/mm/yyyy",
        });
        procesarFilasExcel(filas);
      } catch (error) {
        console.error(error);
        resultadoImportacion.innerHTML =
          '<span style="color:#a44b3f;">No se ha podido leer el archivo. Comprueba que es un .xlsx válido.</span>';
      }
    };
    lector.readAsArrayBuffer(archivo);
  });

  function valorFechaAISO(valor) {
    if (!valor) return null;
    if (valor instanceof Date) {
      const dia = String(valor.getDate()).padStart(2, "0");
      const mes = String(valor.getMonth() + 1).padStart(2, "0");
      const anio = valor.getFullYear();
      return `${anio}-${mes}-${dia}`;
    }
    return convertirFechaDDMMAAAAaISO(String(valor));
  }

  function procesarFilasExcel(filas) {
    const avisos = [];
    let importados = 0;

    filas.forEach((fila, indiceFila) => {
      if (!fila || fila.every((celda) => celda === undefined || celda === "")) {
        return; // fila vacía, se ignora
      }

      const fechaISO = valorFechaAISO(fila[0]);

      // La primera fila puede ser una fila de títulos: si no tiene una
      // fecha válida, la saltamos sin avisar de error.
      if (!fechaISO) {
        if (indiceFila === 0) return;
        avisos.push(
          `Fila ${indiceFila + 1}: la fecha "${fila[0] || ""}" no tiene el formato dd/mm/aaaa, se ha omitido.`
        );
        return;
      }

      const solucion = (fila[1] || "").toString().trim().toUpperCase();
      const pista = (fila[2] || "").toString().trim();

      if (!solucion || !pista) {
        avisos.push(`Fila ${indiceFila + 1} (${fila[0]}): falta la solución o la pista, se ha omitido.`);
        return;
      }

      const pistasObjeto = {};
      const definicion = {
        fragmentos: textoAFragmentos(fila[3]),
        ayuda: (fila[4] || "").toString().trim(),
      };
      const material = {
        fragmentos: textoAFragmentos(fila[5]),
        ayuda: (fila[6] || "").toString().trim(),
      };
      const indicadores = {
        fragmentos: textoAFragmentos(fila[7]),
        ayuda: (fila[8] || "").toString().trim(),
      };
      if (definicion.fragmentos.length) pistasObjeto.definicion = definicion;
      if (material.fragmentos.length) pistasObjeto.material = material;
      if (indicadores.fragmentos.length) pistasObjeto.indicadores = indicadores;

      // Avisamos (sin bloquear la importación) si algún fragmento no
      // aparece literalmente dentro de la pista de esa fila.
      [definicion, material, indicadores].forEach((info) => {
        info.fragmentos.forEach((frag) => {
          if (pista.toLowerCase().indexOf(frag.toLowerCase()) === -1) {
            avisos.push(
              `Fila ${indiceFila + 1} (${fila[0]}): el trozo "${frag}" no aparece tal cual en la pista, no se subrayará.`
            );
          }
        });
      });

      puzzles = puzzles.filter((p) => p.fecha !== fechaISO);
      puzzles.push({ fecha: fechaISO, pista, solucion, pistas: pistasObjeto });
      importados++;
    });

    puzzles = ordenarPuzzlesPorFecha(puzzles);
    renderizarTabla();

    let mensaje = `<p style="color: var(--blue-deep); font-weight:600; margin:0 0 6px;">Se han importado ${importados} puzzle(s) a la lista.</p>`;
    mensaje += `<p style="color: var(--ink-soft); margin:0 0 10px;">Revísalos abajo, edítalos si hace falta, y no olvides descargar el archivo al terminar.</p>`;
    if (avisos.length) {
      mensaje +=
        '<ul style="color:#a44b3f; margin:0; padding-left:18px;">' +
        avisos.map((a) => `<li>${escaparHtml(a)}</li>`).join("") +
        "</ul>";
    }
    resultadoImportacion.innerHTML = mensaje;
    campoExcel.value = "";
  }

  /* ---------------------- Arranque ---------------------- */

  renderizarTabla();
  actualizarVistaPrevia();
})();
