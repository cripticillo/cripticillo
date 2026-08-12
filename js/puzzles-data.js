/* ============================================================================
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

const CRIPTICILLO_PUZZLES = [
  {
    fecha: "2026-08-13",
    pista: "Disfruta ahora masticando media crep",
    solucion: "CARPE DIEM",
    pistas: {
      definicion: {
        fragmentos: ["Disfruta ahora"],
        ayuda: "\"Disfruta ahora\" es la definición, buscamos otra forma de decirlo y que signifique lo mismo",
      },
      material: {
        fragmentos: ["media crep"],
        ayuda: "El material es \"media crep\". Le haremos modificaciones según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["masticando"],
        ayuda: "\"masticando\" es el indicador aquí, viene a significar darle vueltas, hacer cachitos y mover el material",
      },
    },
  },
  {
    fecha: "2026-08-14",
    pista: "4 huevos, 3 nueces, medio plátano, 1/5 mantequilla, sal",
    solucion: "VETE",
    pistas: {
      definicion: {
        fragmentos: ["Sal"],
        ayuda: "\"sal\" es la definición, buscamos otra palabra que signifique lo mismo",
      },
      material: {
        fragmentos: ["huevos", "nueces", "plátano", "mantequilla"],
        ayuda: "El material es \"huevos\", \"nueces\", \"plátano\" y \"mantequilla\". Cogeremos letras de ellos según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["4", "3", "medio", "1/5"],
        ayuda: "\"4\", \"3\", \"medio\" y \"1/5\" son los indicadores, hacen referencia a posiciones de letras",
      },
    },
  },
  {
    fecha: "2026-08-15",
    pista: "Barra con borrachos con pasta",
    solucion: "CARBONARA",
    pistas: {
      definicion: {
        fragmentos: ["Con pasta"],
        ayuda: "\"con pasta\" es la definición, buscamos otra palabra que acompaña a la pasta",
      },
      material: {
        fragmentos: ["barra con"],
        ayuda: "El material es \"barra con\". Le haremos modificaciones según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["borrachos"],
        ayuda: "\"borrachos\" es el indicador de anagrama, fíjate además que está en plural",
      },
    },
  },
  {
    fecha: "2026-08-16",
    pista: "Vieja acaricia sin un temblor",
    solucion: "ARCAICA",
    pistas: {
      definicion: {
        fragmentos: ["Vieja"],
        ayuda: "\"Vieja\" es la definición, buscamos otra palabra que signifique lo mismo",
      },
      material: {
        fragmentos: ["arcaica"],
        ayuda: "El material es \"arcaica\" y \"un\". Usaremos un sustituto lígico de uno y otro en su integridad, Le haremos modificaciones según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["sin", "temblor"],
        ayuda: "\"sin\" y \"temblor\" son indicadores aquí. Uno de eliminación: quitaremos un material de otro; y otro de anagrama",
      },
    },
  },
  {
    fecha: "2026-08-17",
    pista: "Salvo ternera, como variado",
    solucion: "RESCATO",
    pistas: {
      definicion: {
        fragmentos: ["Salvo"],
        ayuda: "\"Salvo\" es la definición, buscamos otra palabra que signifique lo mismo",
      },
      material: {
        fragmentos: ["ternera", "como"],
        ayuda: "El material es \"ternera\" y \"como\". Usaremos sustitutos de ambos",
      },
      indicadores: {
        fragmentos: ["variado"],
        ayuda: "\"variado\" es el indicador, nos indica que tenemos que buscar otra forma de decir los materiales",
      },
    },
  },
  {
    fecha: "2026-08-18",
    pista: "Documentaron pedo y risitas traviesas",
    solucion: "PERIODISTAS",
    pistas: {
      definicion: {
        fragmentos: ["Documentaron"],
        ayuda: "\"Documentaron\" es la definición, buscamos una palabra que realice esa acción",
      },
      material: {
        fragmentos: ["pedo", "risitas"],
        ayuda: "El material es \"pedo\" y \"risitas\". Usaremos sus letras según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["traviesas"],
        ayuda: "\"traviesas\" es el indicador, aunque también servirís \"revoltosas\"",
      },
    },
  },
  {
    fecha: "2026-08-19",
    pista: "Odiseo volvió sin energía tras una conquista bordada",
    solucion: "COSIDO",
    pistas: {
      definicion: {
        fragmentos: ["bordada"],
        ayuda: "\"bordada\" es la definición, buscamos otra palabra que signifique lo mismo",
      },
      material: {
        fragmentos: ["Odiseo", "energía", "conquista"],
        ayuda: "El material es \"Odiseo\", \"energía\" y \"conquista\". Usaremos uno, un sustituto de otro y una parte de otro según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["volvió", "tras", "una", "sin"],
        ayuda: "\"volvió\", \"sin\" \"tras\" y \"una\" son los indicadores. Indican posición, eliminación, colocación e inversión de los materiales",
      },
    },
  },
  {
    fecha: "2026-08-20",
    pista: "En la navidad calienta",
    solucion: "LANA",
    pistas: {
      definicion: {
        fragmentos: ["calienta"],
        ayuda: "\"calienta\" es la definición. Buscamos algo que calienta",
      },
      material: {
        fragmentos: ["la navidad"],
        ayuda: "\"la navidad\" es el material, usaremos algunas de sus letras, según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["En"],
        ayuda: "\"En\" es el indicador, tendremos que fijarnos en el interior del material.",
      },
    },
  },
  {
    fecha: "2026-08-21",
    pista: "Roro confusa tras primer puñetazo, va a la boca",
    solucion: "PORRO",
    pistas: {
      definicion: {
        fragmentos: ["va a la boca"],
        ayuda: "\"va a la boca\" es la definición, buscamos una palabra, algo que normalmente va a la boca",
      },
      material: {
        fragmentos: ["Roro", "puñetazo"],
        ayuda: "Los materiales son \"Roro\" y \"puñetazo\". Debemos de fijarnos en letras espcíficas de una de ellas, según indican los indicadores, y la otra debemos coger sus letras.",
      },
      indicadores: {
        fragmentos: ["confusa", "tras", "primer"],
        ayuda: "\"confusa\", \"tras\" y \"primer\" son los indicadores. Uno de ellos es de posición, un material va después de otro. Otro nos indica en qué letras específicas de un material debemos fijarnos, y otro es un indicador de anagrama, debemos reordenar las letras de un material.",
      },
    },
  },
  {
    fecha: "2026-08-22",
    pista: "Ser apicultora loca sin círculos privados",
    solucion: "PARTICULARES",
    pistas: {
      definicion: {
        fragmentos: ["privados"],
        ayuda: "La definición es \"privados\", buscamos una palabra que signifique lo mismo.",
      },
      material: {
        fragmentos: ["Ser apicultora"],
        ayuda: "\"Ser apicultora\" y \"círculos\" son los materiales, uno debemos sustituirlo por un equivalente y el otro utilizarlo según las indicaciones de los indicadores.",
      },
      indicadores: {
        fragmentos: ["loca", "sin"],
        ayuda: "\"loca\" y \"sin\" son los indicadores. Uno es un indicador de eliminación: retiraremos un material de otro material, y otro es un indicador de anagrama.",
      },
    },
  },
  {
    fecha: "2026-08-23",
    pista: "Revisas naipes barajados",
    solucion: "PEINAS",
    pistas: {
      definicion: {
        fragmentos: ["Revisas"],
        ayuda: "\"Revisas\" es la definición, buscamos una palabra que signifique lo mismo",
      },
      material: {
        fragmentos: ["naipes"],
        ayuda: "\"naipes\" es el material. Le realizaremos los cambios necesarios según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["barajados"],
        ayuda: "\"barajados\" es el indicador. barajaremos las letras del material.",
      },
    },
  },
  {
    fecha: "2026-08-24",
    pista: "Encuentran medialuna rellena de café solo lisboeta",
    solucion: "UBICAN",
    pistas: {
      definicion: {
        fragmentos: ["Encuentran"],
        ayuda: "\"Encuentran\" es la definición. Buscamos una palabra que signifique lo mismo",
      },
      material: {
        fragmentos: ["luna", "café solo lisboeta"],
        ayuda: "\"luna\" y \"café solo lisboeta\" son los materiales, usaremos el equivalente de uno y las letras de otro según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["media", "rellena de"],
        ayuda: "\"media\" y \"rellena de\" son los indicadores. no es uno de contención: un material va dentro de otro, y otro indica las letras del material en las que hemos de fijarnos",
      },
    },
  },
  {
    fecha: "2026-08-25",
    pista: "Chico borde con complejo de cani en casa",
    solucion: "COCINA",
    pistas: {
      definicion: {
        fragmentos: ["en casa"],
        ayuda: "\"en casa\" es la definición. Buscamos algo que se encuentra en casa.",
      },
      material: {
        fragmentos: ["Chico", "cani"],
        ayuda: "\"Chico\" y \"cani\" son los materiales, utilizaremos uno y algunas letras de otro para formar la solución, según las indicaciones de los indicadores.",
      },
      indicadores: {
        fragmentos: ["borde", "complejo de"],
        ayuda: "\"borde\" y \"complejo de\" son los indicadores. Piensa en otros significados que tienen ambos.",
      },
    },
  },
  {
    fecha: "2026-08-26",
    pista: "Haré natación metido en la playa",
    solucion: "ARENA",
    pistas: {
      definicion: {
        fragmentos: ["en la playa"],
        ayuda: "\"en la playa\" es la definición. Buscamos algo que hay en la playa.",
      },
      material: {
        fragmentos: ["Haré natación"],
        ayuda: "\"Haré natación\" es el material, usaremos parte de él para formar la respuesta, según las indicaciones de los indicadores.",
      },
      indicadores: {
        fragmentos: ["metido"],
        ayuda: "\"metido\" es el indicador, buscamos fijarnos en una parte metida en el material.",
      },
    },
  },
  {
    fecha: "2026-08-27",
    pista: "Pájaro esdrújula? no! Cáscara? Sí!",
    solucion: "AVELLANA",
    pistas: {
      definicion: {
        fragmentos: ["Cáscara"],
        ayuda: "\"Cáscara? Sí!\" es la definición. Buscamos una palabra que haga referencia a algo con cáscara",
      },
      material: {
        fragmentos: ["Pájaro esdrújula"],
        ayuda: "\"Pájaro\" y \"esdrújula\" son los materiales. Usaremos un sinónimo de uno y una sustitución de otro, según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["no"],
        ayuda: "\"no\" es un indicador, es complicado, debemos rechazar un material y asignarle otra palabra que tenga sentido.",
      },
    },
  },
  {
    fecha: "2026-08-28",
    pista: "Vuelan huevos revueltos al comenzar la UEFA Champions League",
    solucion: "VEHÍCULOS",
    pistas: {
      definicion: {
        fragmentos: ["Vuelan"],
        ayuda: "\"Vuelan\" es la definición. Buscamos cosas que pueden volar",
      },
      material: {
        fragmentos: ["huevos", "UEFA Champions League"],
        ayuda: "\"huevos\" y \"UEFA Champions League\" son los materiales. A los cuales realizaremos cambios o seleccionaremos fragmentos, según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["revueltos", "al comenzar"],
        ayuda: "\"revueltos\" y \"al comenzar\" son los indicadores, revolveremos todas las letras, las de un material y las añadidas que marca uno de ellos.",
      },
    },
  },
  {
    fecha: "2026-08-29",
    pista: "¿Mascando chicle? Qué básico",
    solucion: "CLICHÉ",
    pistas: {
      definicion: {
        fragmentos: ["Qué básico"],
        ayuda: "\"Qué básico\" es la definición. Buscamos una palabra que venga a significar lo mismo",
      },
      material: {
        fragmentos: ["chicle"],
        ayuda: "\"chicle\" es el material, al cual realizaremos cambios según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["mascando"],
        ayuda: "\"Mascando\" es el indicador, podría parecer de restar pero en este caso quiere decir revolviendo, dando vueltas en la boca.",
      },
    },
  },
  {
    fecha: "2026-08-30",
    pista: "Vecinos de Dinamarca mueven droga, no lo veo bien",
    solucion: "CEGADOR",
    pistas: {
      definicion: {
        fragmentos: ["no lo veo bien"],
        ayuda: "\"no lo veo bien\" es la definición, buscamos algo que nos produzca ese efecto",
      },
      material: {
        fragmentos: ["Dinamarca", "droga"],
        ayuda: "\"Dinamarca\" y \"droga\" son los materiales. Uno de ello lo sustituiremos según un uso que tiene secundario, y el otro lo usaremos. En ambos casos añadiendo cambios según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["vecinos de", "mueven"],
        ayuda: "\"Vecinos de\" y \"mueven\" son los indicadores. Uno es un indicador de anagrama y otro hace referencia a letras que son vecinas de otra",
      },
    },
  },
  {
    fecha: "2026-08-31",
    pista: "¿Seis cromosomas repetidos? yo quiero",
    solucion: "CROMOS",
    pistas: {
      definicion: {
        fragmentos: ["repetidos? yo quiero"],
        ayuda: "\"repetidos? yo quiero\" es la definición, buscamos algo que está guay tener repetido",
      },
      material: {
        fragmentos: ["cromosomas"],
        ayuda: "El material es \"cromosomas\". nos quedaremos con una parte según las indicaciones de los indicadores",
      },
      indicadores: {
        fragmentos: ["Seis"],
        ayuda: "\"Seis\" es el indicador, e indica en qué letras del material debemos fijarnos",
      },
    },
  },
];
