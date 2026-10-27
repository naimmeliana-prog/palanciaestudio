/**
 * @fileoverview Temario completo LOMLOE (Comunitat Valenciana) para CEIP Palancia (Algimia de Alfara)
 * desde 4º de Primaria hasta 6º de Primaria, incluyendo resúmenes, apuntes, fórmulas, trucos mnemotécnicos,
 * preguntas trampa en exámenes, preguntas difíciles recurrentes, cuestionarios y cronograma inicial.
 */

import {
  BeautyTutorial,
  CalendarEventItem,
  CourseGrade,
  MakeupConfig,
  SavedMakeupLook,
  SubjectCurriculum,
  SubjectId,
  TaskCategory,
} from '../types';

export const DEFAULT_MAKEUP_CONFIG: MakeupConfig = {
  lipColor: '#E11D48',
  lipOpacity: 0.72,
  lipGloss: true,
  eyeshadowColor: '#C084FC',
  eyeshadowOpacity: 0.55,
  eyelinerStyle: 'winged',
  blushColor: '#FB7185',
  blushOpacity: 0.45,
  highlighter: true,
  irisColor: '#78350F',
  browIntensity: 0.75,
  faceSticker: 'stars',
  skinTone: '#F5CBA7',
  faceCalibration: {
    eyeLeftX: 37,
    eyeRightX: 63,
    eyesY: 43,
    cheeksY: 54,
    lipsY: 67,
    scale: 100,
  },
};

export const INITIAL_SAVED_LOOKS: SavedMakeupLook[] = [
  {
    id: 'look-brillo-palancia',
    name: 'Brillo Natural Algimia',
    createdAt: '2026-10-20',
    authorNote: 'Ideal para fiestas del cole y fotos de excursión a la Serra Calderona.',
    config: {
      ...DEFAULT_MAKEUP_CONFIG,
      lipColor: '#F43F5E',
      lipOpacity: 0.5,
      lipGloss: true,
      eyeshadowColor: '#FDBA74',
      eyeshadowOpacity: 0.45,
      eyelinerStyle: 'natural',
      blushColor: '#FDA4AF',
      blushOpacity: 0.4,
      highlighter: true,
      faceSticker: 'none',
    },
  },
  {
    id: 'look-estelar-valencia',
    name: 'Fantasía Estelar Rosa',
    createdAt: '2026-10-24',
    authorNote: 'Sombra lavanda brillante con estrellas doradas en los pómulos.',
    config: {
      ...DEFAULT_MAKEUP_CONFIG,
      lipColor: '#DB2777',
      lipOpacity: 0.8,
      lipGloss: true,
      eyeshadowColor: '#A855F7',
      eyeshadowOpacity: 0.7,
      eyelinerStyle: 'winged',
      blushColor: '#FB7185',
      blushOpacity: 0.55,
      highlighter: true,
      faceSticker: 'stars',
    },
  },
];

export const AR_BEAUTY_TUTORIALS: BeautyTutorial[] = [
  {
    id: 'tut-glow-cole',
    title: 'Look 01. Brillo Fresco Mediterráneo',
    subtitle: 'Efecto luminoso suave con bálsamo coral y toque de iluminador solar.',
    durationMinutes: 4,
    difficulty: 'Fácil',
    steps: [
      {
        stepNumber: 1,
        zone: 'cheeks',
        instruction: 'Aplica colorete melocotón suave en el centro de las mejillas sonriendo frente a la cámara.',
        arTip: 'El filtro AR ilumina la zona media del pómulo para no bajar la expresión.',
        recommendedSetting: { blushColor: '#FB923C', blushOpacity: 0.42, highlighter: true },
      },
      {
        stepNumber: 2,
        zone: 'eyes',
        instruction: 'Difumina una sombra champagne dorada en el párpado móvil con delineado natural.',
        arTip: 'Mantén la opacidad al 45% para un acabado luminoso y elegante.',
        recommendedSetting: { eyeshadowColor: '#FDBA74', eyeshadowOpacity: 0.45, eyelinerStyle: 'natural' },
      },
      {
        stepNumber: 3,
        zone: 'lips',
        instruction: 'Finaliza con brillo labial rosa coral hidratante activando el efecto Gloss.',
        arTip: 'El reflejo central en el labio inferior da sensación de volumen suave.',
        recommendedSetting: { lipColor: '#F43F5E', lipOpacity: 0.55, lipGloss: true, faceSticker: 'none' },
      },
    ],
  },
  {
    id: 'tut-fiesta-primaria',
    title: 'Look 02. Gala Festival Fin de Curso',
    subtitle: 'Mirada definida con sombra malva, delineado alado y estrellas brillantes.',
    durationMinutes: 6,
    difficulty: 'Intermedio',
    steps: [
      {
        stepNumber: 1,
        zone: 'eyes',
        instruction: 'Selecciona la sombra lavanda-malva al 65% y activa el delineado "Alado" (Winged).',
        arTip: 'Sigue la línea ascendente desde el rabillo del ojo hacia el final de la ceja.',
        recommendedSetting: { eyeshadowColor: '#C084FC', eyeshadowOpacity: 0.65, eyelinerStyle: 'winged' },
      },
      {
        stepNumber: 2,
        zone: 'cheeks',
        instruction: 'Añade rubor rosa frambuesa suave e iluminador nacarado en la parte alta del pómulo.',
        arTip: 'Combina tonos fríos en mejillas cuando uses sombras violetas o rosas.',
        recommendedSetting: { blushColor: '#FB7185', blushOpacity: 0.5, highlighter: true },
      },
      {
        stepNumber: 3,
        zone: 'stickers',
        instruction: 'Coloca los stickers AR de Estrellas Doradas y labial cereza brillante.',
        arTip: 'Puedes ajustar el calibrador AR si usas tu propia foto o cámara en directo.',
        recommendedSetting: { lipColor: '#E11D48', lipOpacity: 0.75, lipGloss: true, faceSticker: 'stars' },
      },
    ],
  },
  {
    id: 'tut-mariposas-art',
    title: 'Look 03. Fantasía Artística Mariposas',
    subtitle: 'Diseño creativo con delineado gráfico, rubor cereza y mariposas iridiscentes.',
    durationMinutes: 7,
    difficulty: 'Creativo',
    steps: [
      {
        stepNumber: 1,
        zone: 'eyes',
        instruction: 'Aplica sombra turquesa acuarela y selecciona el delineado "Gráfico" de pasarela.',
        arTip: 'El trazo doble en el párpado superior resalta cualquier color de ojos.',
        recommendedSetting: { eyeshadowColor: '#38BDF8', eyeshadowOpacity: 0.6, eyelinerStyle: 'graphic' },
      },
      {
        stepNumber: 2,
        zone: 'lips',
        instruction: 'Equilibra los ojos intensos con un labial frambuesa satinado al 65%.',
        arTip: 'Cuando los ojos llevan colores vivos, un labio equilibrado armoniza el rostro.',
        recommendedSetting: { lipColor: '#DB2777', lipOpacity: 0.65, lipGloss: true },
      },
      {
        stepNumber: 3,
        zone: 'stickers',
        instruction: 'Activa el filtro AR de Mariposas en las mejillas para completar tu look de estudio.',
        arTip: 'Guarda el resultado en tu Galería Personal para compartirlo con mamá y amigas.',
        recommendedSetting: { faceSticker: 'butterflies', highlighter: true },
      },
    ],
  },
];

export const CURRICULUM_DATA: SubjectCurriculum[] = [
  // ============================================================================
  // 4º DE PRIMARIA - CEIP PALANCIA (ALGIMIA DE ALFARA)
  // ============================================================================
  {
    id: SubjectId.MATEMATICAS,
    name: 'Matemáticas',
    valencianName: 'Matemàtiques',
    grade: CourseGrade.FOURTH,
    teacherNote: 'En 4º dominamos la división por 1 y 2 cifras, fracciones propias, números decimales y polígonos.',
    units: [
      {
        id: 'mat-4-u1',
        unitNumber: 1,
        title: 'Divisiones Exactas, Inexactas y Prueba de la División',
        summary: 'Repartir en partes iguales, identificar dividendo, divisor, cociente y resto, y comprobar siempre el resultado antes de entregar el examen.',
        detailedNotes: [
          'Los 4 términos son: Dividendo (D: lo que repartimos), divisor (d: entre cuántos), cociente (c: cuánto toca a cada uno) y resto (r: lo que sobra).',
          'Regla de oro del resto: El resto (r) SIEMPRE tiene que ser estrictamente menor que el divisor (r < d). Si te da igual o mayor, puedes repartir al menos 1 más.',
          'Cuando bajamos una cifra del dividendo y el número formado es menor que el divisor, escribimos "CERO al cociente y bajo la cifra siguiente".',
        ],
        importantFormulas: [
          {
            label: 'Prueba de la División',
            formula: 'D = (d × c) + r',
            meaning: 'Dividendo es igual a divisor por cociente más el resto.',
          },
          {
            label: 'Condición del Resto',
            formula: '0 ≤ r < d',
            meaning: 'Si r = 0 es exacta; si r > 0 es entera o inexacta.',
          },
        ],
        memoryTricks: [
          'Frase mágica: "Cero al cociente y bajo la cifra siguiente" (cántala mentalmente cuando el número bajado no llegue al divisor).',
          'Para acordarte de D = d × c + r: "Debo Dar Cariño Rápido".',
        ],
        studyTips: [
          'En los exámenes del CEIP Palancia, haz SIEMPRE la prueba de la división en una esquina de la hoja antes de pasar al siguiente ejercicio.',
          'Alinea las cifras en columnas verticales limpias para no olvidar bajar ningún número.',
        ],
        trapQuestions: [
          {
            id: 'trap-mat4-1',
            question: 'Al dividir 4.216 entre 4, muchos alumnos escriben de cociente 154 en vez de 1.054. ¿Dónde está la trampa?',
            commonMistake: 'Bajar el 2 (que es menor que 4), bajar directamente el 1 para formar 21 y olvidarse de poner el 0 en el cociente.',
            correctApproach: 'Como 2 es menor que 4, no cabe: ponemos un 0 en el cociente y solo entonces bajamos el 1 para dividir 21 entre 4.',
            exampleSolution: '4216 : 4 -> 4:4=1; bajo el 2 -> 2<4 pongo 0; bajo el 1 -> 21:4=5 (resto 1); bajo el 6 -> 16:4=4. Resultado: 1.054.',
          },
          {
            id: 'trap-mat4-2',
            question: 'En una excursión a la Serra Calderona van 130 alumnos en autobuses de 50 plazas. ¿Cuántos autobuses se necesitan?',
            commonMistake: 'Dividir 130 : 50 = 2 (resto 30) y responder "2 autobuses". ¡Dejarías a 30 niños en Algimia sin excursión!',
            correctApproach: 'Interpretar el resto en problemas reales: si sobran 30 alumnos, hace falta 1 autobús adicional aunque no vaya lleno.',
            exampleSolution: '130 : 50 = 2 y sobran 30 alumnos -> Se necesitan 2 + 1 = 3 autobuses en total.',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-mat4-1',
            title: 'Hallar el Dividendo oculto conociendo divisor, cociente y que el resto es el mayor posible',
            statement: 'En una división el divisor es 8, el cociente es 25 y el resto es el mayor posible. ¿Cuál es el dividendo?',
            stepByStep: [
              'Paso 1: Recordar que el resto siempre es menor que el divisor (r < 8).',
              'Paso 2: Por tanto, el mayor resto posible cuando divides entre 8 es 7 (8 - 1 = 7).',
              'Paso 3: Aplicar la fórmula de la prueba: D = (8 × 25) + 7.',
              'Paso 4: Calcular 8 × 25 = 200, y sumar 7 -> D = 207.',
            ],
            goldenRule: 'El mayor resto posible es siempre (divisor - 1).',
          },
        ],
        quiz: [
          {
            id: 'q-mat4-1',
            question: '¿Cuál es el cociente de dividir 3.024 entre 3?',
            options: ['108', '1.008', '1.080', '1.024'],
            correctIndex: 1,
            explanation: '3:3=1; bajamos 0 (0 al cociente); bajamos 2 (como 2<3, otro 0 al cociente); bajamos 4 -> 24:3=8. Resultado: 1.008.',
          },
          {
            id: 'q-mat4-2',
            question: 'Si el divisor es 9, ¿cuál es el resto más grande que puede quedar sin terminar de dividir?',
            options: ['9', '10', '8', '0'],
            correctIndex: 2,
            explanation: 'El resto siempre debe ser menor que el divisor (r < 9), por lo que el máximo entero es 8.',
          },
        ],
        recommendedMinutes: 20,
      },
      {
        id: 'mat-4-u2',
        unitNumber: 2,
        title: 'Fracciones, Fracción de una Cantidad y Decimales',
        summary: 'Comprender numerador y denominador, comparar fracciones e iniciar décimas y centésimas con monedas y medidas.',
        detailedNotes: [
          'Numerador (arriba): partes que tomamos o pintamos. Denominador (abajo): partes iguales en que se divide la unidad total.',
          'Comparación con igual denominador: es mayor la que tiene MAYOR numerador (ej. 5/8 > 3/8).',
          'Comparación con igual numerador: ¡Cuidado! Es mayor la que tiene MENOR denominador, porque los trozos son más grandes (ej. 1/2 > 1/8).',
        ],
        importantFormulas: [
          {
            label: 'Fracción de un número',
            formula: '(a / b) de N = (N : b) × a',
            meaning: 'Dividimos la cantidad total entre el denominador (abajo) y multiplicamos por el numerador (arriba).',
          },
          {
            label: 'Equivalencia Decimal',
            formula: '1 unidad = 10 décimas = 100 centésimas',
            meaning: '1/10 = 0,1 (una décima) y 1/100 = 0,01 (una centésima).',
          },
        ],
        memoryTricks: [
          '"Abajo divido, arriba multiplico": para calcular 3/5 de 40, primero baja al sótano (40 : 5 = 8) y luego sube al tejado (8 × 3 = 24).',
          'Piensa en una pizza: si la partes entre 2 amigas (1/2) el trozo es enorme; si la partes entre 10 (1/10) el trozo es pequeño.',
        ],
        studyTips: [
          'Subraya en los problemas si te piden la fracción que se ha gastado o la fracción que QUEDA sin gastar.',
        ],
        trapQuestions: [
          {
            id: 'trap-mat4-3',
            question: '¿Qué fracción es mayor: 3/4 o 3/9?',
            commonMistake: 'Pensar que 3/9 es mayor porque el 9 es más grande que el 4.',
            correctApproach: 'Cuando los numeradores son iguales, la fracción con denominador más pequeño tiene trozos más grandes: 3/4 > 3/9.',
            exampleSolution: '3/4 representa tres cuartos de tarta (casi entera), mientras 3/9 es solo un tercio.',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-mat4-2',
            title: 'Problema de fracción de lo que queda en la hucha',
            statement: 'Lucía tiene 60 € ahorrados. Gasta 2/5 en un estuche de pinturas y estudio. ¿Cuánto dinero le QUEDA en la hucha?',
            stepByStep: [
              'Paso 1: Calcular cuánto ha gastado: 2/5 de 60 = (60 : 5) × 2 = 12 × 2 = 24 € gastados.',
              'Paso 2: ¡No pares aquí! La pregunta pide cuánto LE QUEDA.',
              'Paso 3: Restar al total: 60 € - 24 € = 36 € le quedan (que equivale a 3/5 de 60).',
            ],
            goldenRule: 'Lee siempre la última pregunta: ¿pide lo gastado o lo que queda?',
          },
        ],
        quiz: [
          {
            id: 'q-mat4-3',
            question: '¿Cuánto es 3/4 de 80?',
            options: ['20', '40', '60', '75'],
            correctIndex: 2,
            explanation: 'Dividimos 80 entre 4 (= 20) y multiplicamos por 3 (= 60).',
          },
        ],
        recommendedMinutes: 20,
      },
    ],
  },
  {
    id: SubjectId.CASTELLANO,
    name: 'Castellano: Lengua',
    valencianName: 'Castellà: Llengua i Literatura',
    grade: CourseGrade.FOURTH,
    teacherNote: 'Reglas generales de acentuación (agudas, llanas y esdrújulas), prefijos/sufijos y clases de palabras.',
    units: [
      {
        id: 'cas-4-u1',
        unitNumber: 1,
        title: 'Acentuación: Palabras Agudas, Llanas y Esdrújulas (El Método SEGA)',
        summary: 'Localizar la sílaba tónica sin equivocarse y aplicar las reglas de la tilde en agudas, llanas y esdrújulas.',
        detailedNotes: [
          'Agudas: la sílaba tónica es la última. Llevan tilde cuando terminan en N, S o Vocal (ej. ca-mión, com-pás, so-fá).',
          'Llanas (o graves): la sílaba tónica es la penúltima. Llevan tilde cuando NO terminan en N, S ni Vocal (ej. ár-bol, lá-piz, césped).',
          'Esdrújulas: la sílaba tónica es la antepenúltima. Llevan tilde SIEMPRE (ej. mú-si-ca, brú-ju-la, ма-te-má-ti-cas).',
        ],
        importantFormulas: [
          {
            label: 'Regla SEGA (De izquierda a derecha)',
            formula: 'Sobreesdrújula | Esdrújula | Grave (Llana) | Aguda',
            meaning: 'Coloca una letra de SEGA encima de las últimas 4 sílabas contando desde el final.',
          },
        ],
        memoryTricks: [
          'Truco de "NO-SE-VE": Las agudas llevan tilde si acaban en N, S o Vocal (N-S-V -> "No Se Ve").',
          'Las llanas son las rebeldes: llevan tilde justo al revés que las agudas.',
        ],
        studyTips: [
          'Pronuncia la palabra exagerando como si llamaras a alguien desde lejos para notar qué sílaba suena más fuerte.',
        ],
        trapQuestions: [
          {
            id: 'trap-cas4-1',
            question: '¿Por qué "examen" no lleva tilde pero su plural "exámenes" sí lleva tilde?',
            commonMistake: 'Poner tilde a "exámen" en singular por imitar el plural.',
            correctApproach: '"E-xa-men" es llana terminada en -N (no lleva tilde). Al pasar a plural "e-xá-me-nes" gana una sílaba y se convierte en esdrújula (todas llevan tilde).',
            exampleSolution: 'Singular: examen (llana acabada en n, sin tilde). Plural: exámenes (esdrújula, con tilde).',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-cas4-1',
            title: 'Diferenciar diptongo de hiato en palabras con Í / Ú tónicas',
            statement: 'Explica por qué "Ma-rí-a" y "ba-úl" llevan tilde aunque rompan la regla general de las llanas y agudas.',
            stepByStep: [
              'Paso 1: Identificar las vocales abiertas/fuertes (A, E, O) y cerradas/débiles (I, U).',
              'Paso 2: Si la fuerza de la voz recae en la vocal cerrada (I, U) junto a una abierta, se produce un HIATO.',
              'Paso 3: Se pone siempre la tilde en la I o la U para "romper" la unión y separarlas en dos sílabas: Ma-rí-a, ma-íz, ba-úl.',
            ],
            goldenRule: 'Vocal débil (i, u) con fuerza junto a fuerte (a, e, o) lleva tilde siempre aunque rompa las reglas.',
          },
        ],
        quiz: [
          {
            id: 'q-cas4-1',
            question: '¿Cuál de estas palabras es LLANA y debe llevar tilde?',
            options: ['Camion', 'Arbol', 'Telefono', 'Ventana'],
            correctIndex: 1,
            explanation: 'Ár-bol es llana y termina en "l" (distinta de n, s o vocal), por eso lleva tilde: Árbol.',
          },
        ],
        recommendedMinutes: 15,
      },
    ],
  },
  {
    id: SubjectId.VALENCIA,
    name: 'Valencià: Llengua',
    valencianName: 'Valencià: Llengua i Literatura',
    grade: CourseGrade.FOURTH,
    teacherNote: 'Vocabulari del Camp de Morvedre i el Palància, l’apòstrof (l’, d’), la essa sonora i sorda, i accentuació gràfica.',
    units: [
      {
        id: 'val-4-u1',
        unitNumber: 1,
        title: 'L’Apòstrof (el / la / de) i les Excepcions en Femení',
        summary: 'Saber quan apostrofar els articles "el", "la" i la preposició "de" davant de vocal o h muda, sense caure en la trampa de la i/u àtones.',
        detailedNotes: [
          'L’article masculí EL i la preposició DE s’apostrofen sempre davant de qualsevol vocal o H muda: l’arbre, l’home, l’estudi, d’Algímia.',
          'L’article femení LA s’apostrofa davant de vocal o H muda (l’escola, l’amiga, l’hora), EXCEPTE quan la paraula comença per I, U, HI, HU àtones (sense força).',
          'Per això escrivim: "la universitat", "la història", "la idea", "la unió" (sense apòstrof!), però "l’illa" i "l’ungla" (perquè la i/u són tòniques).',
        ],
        importantFormulas: [
          {
            label: 'Regla del Femení LA',
            formula: 'LA + (i, u, hi, hu ÀTONA) = NO s’apostrofa',
            meaning: 'Exemple: la universitat, la història, la humanitat.',
          },
        ],
        memoryTricks: [
          'Recorda les 3 amigues que MAI porten apòstrof en femení: "la universitat, la història i la idea".',
        ],
        studyTips: [
          'Llig en veu alta els dictats del llibre de Valencià del CEIP Palancia fixant-te en les geminades (col·legi, il·lusió).',
        ],
        trapQuestions: [
          {
            id: 'trap-val4-1',
            question: 'Com s’escriu correctament: "l’universitat" o "la universitat"? I "l’illa" o "la illa"?',
            commonMistake: 'Apostrofar "l’universitat" perquè comença per vocal.',
            correctApproach: 'En "u-ni-ver-si-tat" la U és àtona (la força va en -tat), així que NO s’apostrofa: "la universitat". En canvi en "i-lla" la I és tònica, així que SÍ s’apostrofa: "l’illa".',
            exampleSolution: 'Correcte: la universitat, la història, l’illa, l’hora.',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-val4-1',
            title: 'Diferenciar accent obert (`) i accent tancat (´) en Valencià',
            statement: 'Com recordar quines vocals porten accent greu/obert (`) i quines agut/tancat (´)?',
            stepByStep: [
              'Pas 1: La vocal A sempre porta l’accent OBERT cap a l’esquerra (`): València, màquina, càrrega, plàtan.',
              'Pas 2: Les vocals I, U sempre porten l’accent TANCAT cap a la dreta (´): camí, música, autobús.',
              'Pas 3: Les vocals E, O poden ser obertes (cafè, ciència, història, rellotge -> còmode) o tancades (també, lleó, camió).',
            ],
            goldenRule: 'La A sempre oberta (`); la I i la U sempre tancades (´). Mai poses "á" tancada en valencià!',
          },
        ],
        quiz: [
          {
            id: 'q-val4-1',
            question: 'Quina d’aquestes formes està ben escrita en valencià?',
            options: ['L’història d’Espanya', 'La història d’Espanya', 'La història de Espanya', 'L’universitat de València'],
            correctIndex: 1,
            explanation: '"Història" és femenina i comença per "hi" àtona, per tant no s’apostrofa l’article ("la història"), però la preposició "de" sí s’apostrofa davant d’Espanya ("d’Espanya").',
          },
        ],
        recommendedMinutes: 15,
      },
    ],
  },
  {
    id: SubjectId.MEDI,
    name: 'Coneixement del Medi',
    valencianName: 'Coneixement del Medi Natural, Social i Cultural',
    grade: CourseGrade.FOURTH,
    teacherNote: 'L’entorn del riu Palància i la Serra Calderona, la nutrició dels éssers vius, el cicle de l’aigua i el relleu valencià.',
    units: [
      {
        id: 'med-4-u1',
        unitNumber: 1,
        title: 'Les Plantes, la Fotosíntesi i l’Ecosistema del Riu Palància',
        summary: 'Diferenciar saba bruta i saba elaborada, fotosíntesi vs respiració de la planta, i la flora autòctona d’Algímia d’Alfara.',
        detailedNotes: [
          'Saba bruta: mescla d’aigua i sals minerals que absorbeix l’arrel i puja per la tija pels vasos llenyosos (xilema) fins a les fulles.',
          'Fotosíntesi: es realitza a les fulles DE DIA gràcies a la llum solar, la clorofil·la i el diòxid de carboni (CO2). Transforma la saba bruta en saba elaborada (aliment) i expulsa OXIGEN (O2).',
          'Respiració: les plantes respiren DE DIA I DE NIT (agafen oxigen i expulsen diòxid de carboni, igual que nosaltres).',
        ],
        importantFormulas: [
          {
            label: 'Equació de la Fotosíntesi',
            formula: 'Aigua + Sals + CO₂ + Llum Solar → Saba Elaborada + Oxigen (O₂)',
            meaning: 'Durant el dia les plantes fabriquen el seu aliment i alliberen molt més oxigen del que gasten.',
          },
        ],
        memoryTricks: [
          'Saba BRUTA puja per l’ascensor (Xilema); Saba ELABORADA viatja a tota la planta ja cuinada (Floema).',
        ],
        studyTips: [
          'Dibuixa una planta amb fletxes blaves (saba bruta pujant) i fletxes grogues (saba elaborada repartint-se).',
        ],
        trapQuestions: [
          {
            id: 'trap-med4-1',
            question: 'Veritat o Fals: "Les plantes fan la fotosíntesi de dia i respiren sols de nit".',
            commonMistake: 'Marcar Veritat perquè s’associa el dia a la fotosíntesi i la nit a la respiració.',
            correctApproach: 'És FALS! Les plantes respiren les 24 hores del dia (tant de dia com de nit). El que passa és que només fan la fotosíntesi quan hi ha llum.',
            exampleSolution: 'Fals: Les plantes respiren sempre (dia i nit), i fan la fotosíntesi quan tenen llum.',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-med4-1',
            title: 'El curs del riu Palància des del naixement fins a la desembocadura',
            statement: 'Descriu els tres trams (curs alt, mitjà i baix) aplicats al riu Palància que passa per Algímia d’Alfara.',
            stepByStep: [
              'Pas 1 (Curs Alt): Naix a la serra del Toro (Castelló), el pendent és fort i l’aigua baixa ràpida erosionant les roques.',
              'Pas 2 (Curs Mitjà): Passa per la comarca del Camp de Morvedre (prop d’Algímia d’Alfara i la Serra Calderona), el pendent és més suau i les aigües reguen les hortes de tarongers.',
              'Pas 3 (Curs Baix): Desemboca a la mar Mediterrània a Sagunt formant un delta de graves i sediments.',
            ],
            goldenRule: 'Curs alt = erosió (ràpid); Curs mitjà = transport (horta); Curs baix = sedimentació (desembocadura).',
          },
        ],
        quiz: [
          {
            id: 'q-med4-1',
            question: 'Quin gas absorbeixen les plantes de l’aire per a poder fer la fotosíntesi?',
            options: ['Oxigen', 'Diòxid de carboni (CO2)', 'Nitrogen', 'Vapor d’aigua'],
            correctIndex: 1,
            explanation: 'En la fotosíntesi la planta absorbeix diòxid de carboni (CO2) per les fulles i allibera oxigen (O2).',
          },
        ],
        recommendedMinutes: 20,
      },
    ],
  },
  {
    id: SubjectId.INGLES,
    name: 'Inglés (English)',
    valencianName: 'Anglés (English)',
    grade: CourseGrade.FOURTH,
    teacherNote: 'Present Simple vs Present Continuous, rutinas diarias, la S de tercera persona (He/She/It) y preposiciones de tiempo.',
    units: [
      {
        id: 'ing-4-u1',
        unitNumber: 1,
        title: 'Present Simple (Routines) vs Present Continuous (Now)',
        summary: 'Distinguir lo que hacemos habitualmente (every day, usually) de lo que está ocurriendo ahora mismo (now, Look!).',
        detailedNotes: [
          'Present Simple (Rutinas): Con He / She / It añadimos "-s" o "-es" al verbo en afirmativa (She plays, He watches, It goes). En negativa e interrogativa usamos DOESN’T / DOES y el verbo vuelve a su forma normal sin "-s" (She doesn’t play).',
          'Present Continuous (Ahora mismo): Usamos el verbo TO BE (am / is / are) + Verbo con "-ing" (I am studying, She is wearing makeup).',
          'Preposiciones de tiempo: IN (meses, estaciones, partes del día: in May, in the morning), ON (días de la semana y fechas: on Monday), AT (horas exactas y night: at 5 o’clock, at night).',
        ],
        importantFormulas: [
          {
            label: 'Super S Rule (He / She / It)',
            formula: '(+) She plays  |  (-) She doesn’t play  |  (?) Does she play?',
            meaning: 'Cuando aparece DOES o DOESN’T, "se come" la S del verbo principal.',
          },
        ],
        memoryTricks: [
          '"DOES es un monstruo hambriento que se come la S del verbo": nunca escribas "Does she plays?", escribe "Does she play?".',
          'Truco IN-ON-AT: de grande a pequeño -> IN (meses/años), ON (días), AT (hora exacta en el reloj).',
        ],
        studyTips: [
          'Busca siempre la palabra pista (Time Expression) en la frase antes de elegir el verbo: "every day/always" -> Present Simple; "now/at the moment/Look!" -> Present Continuous.',
        ],
        trapQuestions: [
          {
            id: 'trap-ing4-1',
            question: 'Completa la frase: "Lucía _______ (not / like) broccoli on Mondays."',
            commonMistake: 'Escribir "Lucía don’t like" o "Lucía doesn’t likes".',
            correctApproach: 'Lucía es tercera persona singular (She), así que usa "doesn’t" y el verbo queda sin -s: "doesn’t like".',
            exampleSolution: 'Lucía doesn’t like broccoli on Mondays.',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-ing4-1',
            title: 'Orden correcto de los Adverbios de Frecuencia (Always, Usually, Sometimes, Never)',
            statement: '¿Dónde se coloca "always" o "usually" en una frase en inglés?',
            stepByStep: [
              'Paso 1: Delante del verbo normal: "I ALWAYS do my homework" (Yo siempre hago mis deberes).',
              'Paso 2: ¡Excepción! Detrás del verbo TO BE (am, is, are): "She IS ALWAYS happy" (Ella está siempre feliz).',
            ],
            goldenRule: 'Before main verbs (I always study), AFTER verb To Be (I am always ready).',
          },
        ],
        quiz: [
          {
            id: 'q-ing4-1',
            question: 'Choose the correct sentence: "Look! My sister _______ a picture right now."',
            options: ['paints', 'is painting', 'painting', 'does paint'],
            correctIndex: 1,
            explanation: '"Look!" y "right now" indican que ocurre en este instante (Present Continuous: is + verbo-ing).',
          },
        ],
        recommendedMinutes: 15,
      },
    ],
  },
  {
    id: SubjectId.ARTISTICA,
    name: 'Artística y Música',
    valencianName: 'Educació Artística i Música',
    grade: CourseGrade.FOURTH,
    teacherNote: 'Figuras musicales y silencios, compases de 2/4, 3/4 y 4/4, y teoría del color (primarios, secundarios y complementarios).',
    units: [
      {
        id: 'art-4-u1',
        unitNumber: 1,
        title: 'El Valor de las Figuras Musicales y el Puntillo',
        summary: 'Calcular cuántos tiempos suma cada figura para completar compases sin pasarse ni quedarse corto.',
        detailedNotes: [
          'Redonda = 4 tiempos (tiempos de negra). Blanca = 2 tiempos. Negra = 1 tiempo. Corchea = 1/2 tiempo (2 corcheas = 1 tiempo). Semicorchea = 1/4 tiempo (4 semicorcheas = 1 tiempo).',
          'El Puntillo: un punto a la derecha de la figura le suma la MITAD de su valor. Por tanto, una Blanca con puntillo vale 2 + 1 = 3 tiempos.',
          'Colores luz vs pigmento: En plástica/maquillaje los primarios son Cian, Magenta y Amarillo; al mezclarlos obtenemos Violeta, Verde y Naranja.',
        ],
        importantFormulas: [
          {
            label: 'Fórmula del Puntillo Musical',
            formula: 'Valor Total = Figura + (Figura / 2)',
            meaning: 'Blanca con puntillo = 2 + 1 = 3 tiempos. Negra con puntillo = 1 + 0,5 = 1,5 tiempos.',
          },
        ],
        memoryTricks: [
          '1 Redonda = 2 Blancas = 4 Negras = 8 Corcheas = 16 Semicorcheas (cada escalón multiplica por 2).',
        ],
        studyTips: [
          'En los ejercicios de rellenar líneas divisorias de compás, escribe debajo de cada nota su número (2, 1, 1/2+1/2) y cierra el compás al sumar 2, 3 o 4.',
        ],
        trapQuestions: [
          {
            id: 'trap-art4-1',
            question: '¿Cuántas corcheas caben en un compás de 3/4?',
            commonMistake: 'Responder 3 corcheas.',
            correctApproach: 'En un 3/4 caben 3 negras. Como cada negra equivale a 2 corcheas, caben 3 × 2 = 6 corcheas.',
            exampleSolution: '6 corcheas = 3 tiempos completos.',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-art4-1',
            title: 'Colores Complementarios en Plástica y Estudio de Belleza',
            statement: '¿Qué es el color complementario de otro y para qué sirve en arte y maquillaje?',
            stepByStep: [
              'Paso 1: Es el color situado justo enfrente en el círculo cromático (el que no interviene en su mezcla).',
              'Paso 2: Complementario del Amarillo -> Violeta (mezcla de azul + magenta).',
              'Paso 3: Complementario del Azul Cian -> Naranja. Complementario del Magenta/Rojo -> Verde.',
            ],
            goldenRule: 'Los colores complementarios puestos juntos crean el máximo contraste y brillo visual.',
          },
        ],
        quiz: [
          {
            id: 'q-art4-1',
            question: '¿Cuántos tiempos dura una blanca con puntillo más una negra?',
            options: ['3 tiempos', '4 tiempos', '5 tiempos', '2 tiempos y medio'],
            correctIndex: 1,
            explanation: 'Blanca con puntillo (2 + 1 = 3 tiempos) + Negra (1 tiempo) = 4 tiempos (un compás de 4/4 entero).',
          },
        ],
        recommendedMinutes: 15,
      },
    ],
  },

  // ============================================================================
  // 5º DE PRIMARIA - CEIP PALANCIA (ALGIMIA DE ALFARA)
  // ============================================================================
  {
    id: SubjectId.MATEMATICAS,
    name: 'Matemáticas',
    valencianName: 'Matemàtiques',
    grade: CourseGrade.FIFTH,
    teacherNote: 'Operaciones con fracciones de distinto denominador, operaciones con decimales, cambios de unidades (m, l, g, m²) y áreas.',
    units: [
      {
        id: 'mat-5-u1',
        unitNumber: 1,
        title: 'Suma y Resta de Fracciones y Escalera de Unidades de Superficie (m²)',
        summary: 'Reducir fracciones a común denominador y dominar los saltos de 10 en 10 (longitud) frente a los saltos de 100 en 100 (superficie).',
        detailedNotes: [
          'Para sumar o restar fracciones con distinto denominador NUNCA se suman los denominadores directamente. Primero buscamos el común denominador.',
          'En la escalera de longitud (km, hm, dam, m, dm, cm, mm): bajar es multiplicar por 10; subir es dividir entre 10.',
          'En la escalera de SUPERFICIE (km², hm², dam², m², dm², cm², mm²): como lleva un "2" en el exponente, cada escalón multiplica o divide por 100 (dos ceros por escalón).',
        ],
        importantFormulas: [
          {
            label: 'Área del Triángulo',
            formula: 'A = (Base × Altura) / 2',
            meaning: '¡Nunca olvides dividir entre 2 en el triángulo! Un triángulo es la mitad de un rectángulo.',
          },
          {
            label: 'Escalón de Superficie',
            formula: '1 m² = 100 dm² = 10.000 cm²',
            meaning: 'Cada salto en unidades cuadradas añade o quita 2 ceros.',
          },
        ],
        memoryTricks: [
          'El exponente te dice cuántos ceros vale cada escalón: m¹ -> 1 cero (×10); m² -> 2 ceros (×100); m³ -> 3 ceros (×1.000).',
        ],
        studyTips: [
          'En problemas de geometría, comprueba que la base y la altura estén en la MISMA unidad (por ejemplo, todo en cm) antes de multiplicar.',
        ],
        trapQuestions: [
          {
            id: 'trap-mat5-1',
            question: 'Calcula el área de un triángulo cuya base mide 2 metros y su altura 50 centímetros.',
            commonMistake: 'Multiplicar 2 × 50 / 2 = 50 sin cambiar antes los 2 metros a centímetros.',
            correctApproach: 'Pasar todo a la misma unidad primero: 2 m = 200 cm. Ahora sí: Área = (200 × 50) / 2 = 5.000 cm².',
            exampleSolution: '2 m = 200 cm -> (200 cm × 50 cm) / 2 = 5.000 cm² (o 0,5 m²).',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-mat5-1',
            title: 'Dividir un número decimal entre otro decimal (ej. 14,4 : 1,2)',
            statement: '¿Cómo se hace una división cuando hay coma en el divisor?',
            stepByStep: [
              'Paso 1: No se puede empezar a dividir con coma en el divisor.',
              'Paso 2: Multiplicamos dividendo y divisor por 10 (o 100) para quitar la coma del divisor.',
              'Paso 3: En 14,4 : 1,2 movemos la coma un lugar a la derecha en ambos -> queda 144 : 12 = 12.',
            ],
            goldenRule: 'Tacha la coma del divisor y mueve la coma del dividendo tantos lugares como decimales tenía el divisor.',
          },
        ],
        quiz: [
          {
            id: 'q-mat5-1',
            question: '¿Cuántos dm² son 3,5 m²?',
            options: ['35 dm²', '350 dm²', '3.500 dm²', '0,35 dm²'],
            correctIndex: 1,
            explanation: 'De m² a dm² bajamos 1 escalón de superficie, por lo que multiplicamos por 100: 3,5 × 100 = 350 dm².',
          },
        ],
        recommendedMinutes: 25,
      },
    ],
  },
  {
    id: SubjectId.CASTELLANO,
    name: 'Castellano: Lengua',
    valencianName: 'Castellà: Llengua i Literatura',
    grade: CourseGrade.FIFTH,
    teacherNote: 'Diptongos, triptongos e hiatos, determinantes vs pronombres, y análisis del grupo nominal.',
    units: [
      {
        id: 'cas-5-u1',
        unitNumber: 1,
        title: 'Diptongos vs Hiatos y Diferencia entre Determinante y Pronombre',
        summary: 'Separar sílabas con vocales juntas y no confundir nunca un determinante demostrativo/posesivo con un pronombre.',
        detailedNotes: [
          'Vocales Abiertas (Fuertes): A, E, O. Vocales Cerradas (Débiles): I, U.',
          'Dos Fuertes juntas (A, E, O) NUNCA caben en la misma sílaba: forman siempre HIATO (te-a-tro, po-e-ta, to-a-lla) y siguen las reglas generales SEGA.',
          'Determinante vs Pronombre: El Determinante ACOMPAÑA al sustantivo ("Este libro"); el Pronombre SUSTITUYE al sustantivo, va sin nombre detrás ("Este es mío").',
        ],
        importantFormulas: [
          {
            label: 'Fórmula de Vocales',
            formula: 'Fuerte + Fuerte = HIATO (se separan) | Débil tónica (í, ú) + Fuerte = HIATO (con tilde siempre)',
            meaning: 'En los demás casos (Fuerte + Débil átona o Débil + Débil) forman DIPTONGO (van juntas en la misma sílaba).',
          },
        ],
        memoryTricks: [
          'Imagina que A, E, O son luchadores de sumo muy grandes: dos grandes no caben en el mismo ascensor (sílaba), así que se separan en hiato.',
        ],
        studyTips: [
          'Rodea siempre el sustantivo primero cuando te pidan analizar determinantes, adjetivos y pronombres.',
        ],
        trapQuestions: [
          {
            id: 'trap-cas5-1',
            question: 'En la oración "Aquella mochila es tuya, pero esta es mía", ¿qué palabras son determinantes y cuáles pronombres?',
            commonMistake: 'Decir que "esta" y "Aquella" son las dos determinantes demostrativos.',
            correctApproach: '"Aquella" acompaña al sustantivo "mochila" -> Determinante. "esta" no lleva sustantivo detrás (sustituye a mochila) -> Pronombre.',
            exampleSolution: 'Aquella = determinante demostrativo; esta = pronombre demostrativo.',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-cas5-1',
            title: 'Por qué "hueso" no lleva tilde pero "huésped" sí lleva tilde',
            statement: 'Analiza el diptongo en "hue-so" y "hués-ped".',
            stepByStep: [
              'Paso 1: "U + E" (débil átona + fuerte) forman diptongo, así que van en la misma sílaba.',
              'Paso 2: "Hue-so" es llana acabada en vocal -> no lleva tilde.',
              'Paso 3: "Hués-ped" es llana acabada en -d -> lleva tilde sobre la vocal abierta (é).',
            ],
            goldenRule: 'En los diptongos con tilde, la tilde se coloca siempre sobre la vocal abierta (a, e, o) o en la segunda si las dos son cerradas (cuí-da-te).',
          },
        ],
        quiz: [
          {
            id: 'q-cas5-1',
            question: '¿Cuál de estas palabras contiene un HIATO?',
            options: ['Cielo', 'Peine', 'Teatro', 'Ciudad'],
            correctIndex: 2,
            explanation: 'Te-a-tro tiene dos vocales abiertas/fuertes juntas (e-a), por lo que se separan en sílabas distintas formando un hiato.',
          },
        ],
        recommendedMinutes: 20,
      },
    ],
  },
  {
    id: SubjectId.VALENCIA,
    name: 'Valencià: Llengua',
    valencianName: 'Valencià: Llengua i Literatura',
    grade: CourseGrade.FIFTH,
    teacherNote: 'Accentuació diacrítica (mà, pèl, sòl, són), contraccions (al, del, pel) i grafies B/V i G/J.',
    units: [
      {
        id: 'val-5-u1',
        unitNumber: 1,
        title: 'Les Contraccions (al, del, pel) i l’Accent Diacrític',
        summary: 'Dominar quan es fa contracció i quan cal apostrofar ("a l’escola" vs "al pati"), i diferenciar paraules amb accent diacrític.',
        detailedNotes: [
          'Les preposicions A, DE, PER es contrauen amb els articles EL, ELS formant: AL / ALS, DEL / DELS, PEL / PELS.',
          'ATENCIÓ: Si la paraula següent es pot apostrofar amb "el" (perquè comença per vocal o h), NO es fa contracció sinó que s’apostrofa: escrivim "Vaig a l’institut" (mai "al institut"), "Vinc de l’hort" (mai "del hort").',
          'Accents diacrítics clau: és (verb ser) vs es (pronom); són (verb ser) vs son (ganes de dormir); mà (part del cos) vs ma (possessiu).',
        ],
        importantFormulas: [
          {
            label: 'Llei de Prioritat de l’Apòstrof',
            formula: 'a + el + home → a l’home (l’apòstrof guanya a la contracció)',
            meaning: 'Si "el" es pot apostrofar (l’home), desfem la contracció "al".',
          },
        ],
        memoryTricks: [
          '"L’apòstrof mana sobre la contracció": prova primer si diries "l’arbre". Si és que sí, escriu "a l’arbre, de l’arbre, per l’arbre".',
        ],
        studyTips: [
          'Fes una mini-llista de parelles amb dibuix: "Tinc molta SON (dormir) / Elles SÓN amigues (verb ser)".',
        ],
        trapQuestions: [
          {
            id: 'trap-val5-1',
            question: 'Tria l’opció correcta: "Anem pel camí fins al hospital" o "Anem pel camí fins a l’hospital"?',
            commonMistake: 'Escriure "al hospital" per influència del castellà.',
            correctApproach: 'Com que "hospital" comença per h muda, diem "l’hospital". Per tant, la contracció es trenca: "fins a l’hospital".',
            exampleSolution: 'Correcte: Anem pel camí fins a l’hospital.',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-val5-1',
            title: 'Quan escriure PER i quan escriure PER A en valencià',
            statement: 'Diferència pràctica entre "per" i "per a" davant de nom o infinitiu.',
            stepByStep: [
              'Pas 1: Davant de nom o pronom que indica destinatari o finalitat, usem PER A: "Un regal per a la mare".',
              'Pas 2: Davant d’un verb en infinitiu que indica finalitat ("para estudiar"), en valencià normatiu també mantenim PER A: "Una web per a estudiar millor".',
            ],
            goldenRule: 'Si significa destinació o finalitat ("para"), escriu "per a".',
          },
        ],
        quiz: [
          {
            id: 'q-val5-1',
            question: 'Completa la frase: "Els tarongers ______ (de + el) riu Palància ______ (verb ser) molt bonics."',
            options: ['del / son', 'del / són', 'de l’ / són', 'dels / son'],
            correctIndex: 1,
            explanation: '"Riu" comença per consonant, així que fa contracció ("del riu"), i "són" del verb ser porta accent diacrític tancat.',
          },
        ],
        recommendedMinutes: 20,
      },
    ],
  },
  {
    id: SubjectId.MEDI,
    name: 'Coneixement del Medi',
    valencianName: 'Coneixement del Medi Natural, Social i Cultural',
    grade: CourseGrade.FIFTH,
    teacherNote: 'Els aparells del cos humà (digestiu, respiratori, circulatori, excretor), la matèria (massa, volum, densitat) i l’Edat Mitjana.',
    units: [
      {
        id: 'med-5-u1',
        unitNumber: 1,
        title: 'La Nutrició Humana i Propietats de la Matèria (Massa, Volum i Densitat)',
        summary: 'Entendre com viatgen els nutrients i l’oxigen per la sang i per què uns cossos suren en l’aigua i altres s’enfonsen.',
        detailedNotes: [
          'La funció de nutrició necessita 4 aparells treballant en equip: Digestiu (obté nutrients), Respiratori (obté O2 i expulsa CO2 als alvèols pulmonars), Circulatori (reparteix tot per la sang) i Excretor (filtra la sang als renyons per netejar residus).',
          'Massa: quantitat de matèria d’un cos (es mesura en kg o g amb la balança). Volum: espai que ocupa un cos (es mesura en litres o cm³ amb la proveta).',
          'Densitat: relació entre la massa i el volum (D = Massa / Volum). Un cos sura en l’aigua si la seua densitat és MENOR que la de l’aigua (1 g/cm³).',
        ],
        importantFormulas: [
          {
            label: 'Fórmula de la Densitat',
            formula: 'Densitat (d) = Massa (m) / Volum (V)',
            meaning: 'Si d < 1 g/cm³ el cos sura en l’aigua (com el suro o l’oli); si d > 1 g/cm³ s’enfonsa (com el ferro).',
          },
        ],
        memoryTricks: [
          'Artèries vs Venes: Les Artèries IXEN del cor; les Venes VÉNEN al cor ("Venes = Vénen").',
        ],
        studyTips: [
          'No confongues l’aparell excretor (renyons i orina) amb l’expulsió de femta (que és el final de l’aparell digestiu!).',
        ],
        trapQuestions: [
          {
            id: 'trap-med5-1',
            question: 'Què pesa més: 1 kg de palla o 1 kg de ferro? Quin té més volum i quin té més densitat?',
            commonMistake: 'Dir que el ferro pesa més.',
            correctApproach: 'Tots dos tenen exactament la mateixa massa (1 kg)! La diferència és que la palla ocupa molt més VOLUM i el ferro té molta més DENSITAT.',
            exampleSolution: 'Mateixa massa (1 kg), major volum la palla, major densitat el ferro.',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-med5-1',
            title: 'On es produeix exactament l’intercanvi de gasos i el pas de nutrients a la sang?',
            statement: 'Pregunta clàssica d’examen: anomena l’estructura exacta on passen els nutrients i l’oxigen a la sang.',
            stepByStep: [
              'Pas 1 (Nutrients): Passen a la sang a l’INTESTÍ PRIM (no a l’estómac!) a través de les vellositats intestinals.',
              'Pas 2 (Oxigen): Passa a la sang als ALVÈOLS PULMONARS envoltats de capil·lars sanguinis.',
              'Pas 3 (Filtratge de residus): Es realitza als RENYONS (aparell excretor).',
            ],
            goldenRule: 'Intestí prim = absorció de nutrients; Alvèols = intercanvi de gasos; Renyons = filtratge de la sang.',
          },
        ],
        quiz: [
          {
            id: 'q-med5-1',
            question: 'Per quins vasos sanguinis torna la sang des dels òrgans cap al cor?',
            options: ['Per les artèries', 'Per les venes', 'Pels alvèols', 'Pels bronquis'],
            correctIndex: 1,
            explanation: 'Les venes ("vénen") porten la sang de tornada al cor, mentre que les artèries ixen del cor.',
          },
        ],
        recommendedMinutes: 25,
      },
    ],
  },

  // ============================================================================
  // 6º DE PRIMARIA - CEIP PALANCIA (ALGIMIA DE ALFARA)
  // ============================================================================
  {
    id: SubjectId.MATEMATICAS,
    name: 'Matemáticas',
    valencianName: 'Matemàtiques',
    grade: CourseGrade.SIXTH,
    teacherNote: 'Preparación para el paso al IES: M.C.M. y M.C.D., jerarquía de operaciones combinadas, porcentajes, regla de tres y volúmenes.',
    units: [
      {
        id: 'mat-6-u1',
        unitNumber: 1,
        title: 'M.C.M. vs M.C.D., Porcentajes y Jerarquía de Operaciones (PAPOMUDAS)',
        summary: 'Distinguir cuándo un problema pide Mínimo Común Múltiplo (coincidir en el futuro) o Máximo Común Divisor (repartir en trozos iguales máximos).',
        detailedNotes: [
          'Jerarquía de operaciones combinadas (PAPOMUDAS): 1º Paréntesis y corchetes, 2º Potencias y raíces, 3º Multiplicaciones y Divisiones (de izquierda a derecha), 4º Sumas y Restas (de izquierda a derecha).',
          'Mínimo Común Múltiplo (m.c.m.): Comunes y no comunes elevados al MAYOR exponente. Se usa en problemas de coincidencia temporal ("¿cuándo volverán a coincidir dos autobuses o dos faros?").',
          'Máximo Común Divisor (M.C.D.): Solo los factores comunes elevados al MENOR exponente. Se usa para cortar o repartir en partes iguales lo más grandes posible sin que sobre nada.',
        ],
        importantFormulas: [
          {
            label: 'Porcentaje y Descuento',
            formula: 'P% de N = (P × N) / 100',
            meaning: 'Para calcular el 15% de 80 €, multiplicamos 15 × 80 = 1.200 y dividimos entre 100 = 12 €.',
          },
          {
            label: 'Longitud de Circunferencia y Área del Círculo',
            formula: 'L = 2 × π × r   |   A = π × r²  (π ≈ 3,14)',
            meaning: 'Atención: r² es "radio por radio", ¡nunca radio por 2! Y recuerda que el radio es la mitad del diámetro (r = D / 2).',
          },
        ],
        memoryTricks: [
          'Palabra clave "PAPOMUDAS": PAréntesis -> POtencias -> MUltiplicación/División -> Adición/Sustracción.',
          'Si el problema pregunta "¿Cuándo coinciden otra vez?" -> m.c.m. Si pregunta "¿De qué tamaño máximo cortamos sin que sobre?" -> M.C.D.',
        ],
        studyTips: [
          'En geometría de 6º ponen siempre el DIÁMETRO en el dibujo para ver si picas: divide el diámetro entre 2 para obtener el radio antes de usar la fórmula.',
        ],
        trapQuestions: [
          {
            id: 'trap-mat6-1',
            question: 'Calcula: 20 - 4 × (3 + 2). ¿Por qué da 0 si se hace mal y 0 no es la respuesta correcta?',
            commonMistake: 'Restar primero 20 - 4 = 16 y luego multiplicar 16 × 5 = 80.',
            correctApproach: 'Primero paréntesis: (3 + 2) = 5. Luego la multiplicación ANTES que la resta: 4 × 5 = 20. Finalmente: 20 - 20 = 0. (¡El error es que muchos ponen 80 por restar 20 - 4 al principio!).',
            exampleSolution: '20 - 4 × (3 + 2) = 20 - 4 × 5 = 20 - 20 = 0 (nunca 80).',
          },
          {
            id: 'trap-mat6-2',
            question: 'Calcula el área de una fuente circular de Algimia de Alfara cuyo DIÁMETRO mide 6 metros.',
            commonMistake: 'Usar 6 como radio y además hacer 6 × 2 en lugar de 6².',
            correctApproach: 'Si el diámetro es 6 m, el radio es la mitad: r = 3 m. Ahora r² = 3 × 3 = 9. Área = 3,14 × 9 = 28,26 m².',
            exampleSolution: 'r = 6 : 2 = 3 m -> A = 3,14 × 3² = 3,14 × 9 = 28,26 m².',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-mat6-1',
            title: 'Problema completo con Descuento + IVA (Subida y Bajada Porcentual)',
            statement: 'Un set de escritorio cuesta 50 €. Tiene una rebaja del 20%, pero luego hay que sumarle el 10% de envío especial. ¿Cuál es el precio final?',
            stepByStep: [
              'Paso 1: Calcular el descuento del 20% sobre 50 € -> (20 × 50) / 100 = 10 € de descuento.',
              'Paso 2: Restar para obtener el precio rebajado -> 50 € - 10 € = 40 €.',
              'Paso 3: Calcular el 10% sobre el NUEVO precio (40 €, no sobre 50 €) -> (10 × 40) / 100 = 4 €.',
              'Paso 4: Sumar -> 40 € + 4 € = 44 € precio final.',
            ],
            goldenRule: 'Los porcentajes encadenados nunca se restan ni suman entre sí directamente; se calculan paso a paso sobre el nuevo precio.',
          },
        ],
        quiz: [
          {
            id: 'q-mat6-1',
            question: 'Un autobús pasa por Algimia cada 12 minutos y otro cada 18 minutos. Si coinciden a las 10:00, ¿dentro de cuántos minutos volverán a coincidir?',
            options: ['6 minutos', '24 minutos', '36 minutos', '72 minutos'],
            correctIndex: 2,
            explanation: 'Es un problema de coincidencia -> m.c.m.(12, 18) = 36 minutos. Volverán a coincidir a las 10:36.',
          },
        ],
        recommendedMinutes: 30,
      },
    ],
  },
  {
    id: SubjectId.CASTELLANO,
    name: 'Castellano: Lengua',
    valencianName: 'Castellà: Llengua i Literatura',
    grade: CourseGrade.SIXTH,
    teacherNote: 'Análisis sintáctico de la oración (Sujeto, Predicado, CD, CI, CC), verbos regulares e irregulares y tilde diacrítica.',
    units: [
      {
        id: 'cas-6-u1',
        unitNumber: 1,
        title: 'Sintaxis sin Fallos: Sujeto, Predicado, CD, CI y Complementos Circunstanciales',
        summary: 'Pasos infalibles para encontrar el Sujeto (aunque esté desordenado u omitido) y distinguir Complemento Directo de Indirecto.',
        detailedNotes: [
          'Para hallar el Sujeto NUNCA preguntes "¿Quién?" al verbo sin más, porque puedes confundirlo con el CD o CI. Usa la PRUEBA DE LA CONCORDANCIA: cambia el verbo de singular a plural; las palabras que obligatoriamente cambien con él son el Sujeto.',
          'Un Sujeto NUNCA empieza por preposición ("A mis amigas les gusta el maquillaje" -> el sujeto es "el maquillaje", porque si dices "les gustan", cambia a "los maquillajes").',
          'Complemento Directo (CD): Se sustituye por LO, LA, LOS, LAS. Complemento Indirecto (CI): Se sustituye por LE, LES.',
        ],
        importantFormulas: [
          {
            label: 'Prueba de la Concordancia del Sujeto',
            formula: 'Cambia el Verbo a Plural → Lo que cambie de número = SUJETO',
            meaning: 'En "Me encanta este estuche" -> "Me encantan estos estuches" -> Sujeto: "este estuche".',
          },
        ],
        memoryTricks: [
          'Sujeto con preposición = ¡PROHIBIDO! Jamás subrayes algo que empiece por "A..." como sujeto.',
        ],
        studyTips: [
          'En el examen busca SIEMPRE primero el verbo, hazle la prueba del plural para encontrar el Sujeto, y todo lo demás es Predicado.',
        ],
        trapQuestions: [
          {
            id: 'trap-cas6-1',
            question: '¿Cuál es el Sujeto en la oración: "A Lucía le encantan los pinceles de colores"?',
            commonMistake: 'Subrayar "A Lucía" como Sujeto.',
            correctApproach: '"A Lucía" empieza por la preposición "A" (es Complemento Indirecto: "le"). Si ponemos el verbo en singular ("le encanta"), cambia a "el pincel". Por tanto, el Sujeto es "los pinceles de colores".',
            exampleSolution: 'Sujeto: "los pinceles de colores" | Predicado: "A Lucía le encantan".',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-cas6-1',
            title: 'Distinguir Tilde Diacrítica en monosílabos de examen (el/él, tu/tú, mi/mí, se/sé, de/dé)',
            statement: 'Por regla general los monosílabos NO llevan tilde, salvo los que tienen tilde diacrítica para diferenciar su categoría.',
            stepByStep: [
              'Paso 1: ÉL (pronombre: "Él estudia") vs EL (artículo: "El libro").',
              'Paso 2: TÚ (pronombre: "Tú ganas") vs TU (posesivo: "Tu agenda").',
              'Paso 3: SÉ (verbo saber/ser: "Ya lo sé") vs SE (pronombre: "Se maquilla").',
              'Paso 4: ¡Trampa clásica! "TI", "FE", "VIO", "DIO", "FUI" NUNCA llevan tilde porque no tienen pareja con la que confundirse.',
            ],
            goldenRule: 'El pronombre "TI" jamás lleva tilde ("Esto es para ti").',
          },
        ],
        quiz: [
          {
            id: 'q-cas6-1',
            question: '¿Cuál de estas palabras monosílabas NUNCA lleva tilde en español?',
            options: ['Él', 'Sé', 'Ti', 'Mí'],
            correctIndex: 2,
            explanation: '"Ti" nunca lleva tilde porque no existe otra palabra "ti" con significado distinto.',
          },
        ],
        recommendedMinutes: 25,
      },
    ],
  },
  {
    id: SubjectId.INGLES,
    name: 'Inglés (English)',
    valencianName: 'Anglés (English)',
    grade: CourseGrade.SIXTH,
    teacherNote: 'Past Simple (Regular & Irregular Verbs), Comparatives & Superlatives, y Going to para planes futuros.',
    units: [
      {
        id: 'ing-6-u1',
        unitNumber: 1,
        title: 'Past Simple (DID / DIDN’T) & Comparative / Superlative Adjectives',
        summary: 'Dominar los verbos en pasado (regulares con -ed e irregulares) y comparar adjetivos cortos, largos e irregulares.',
        detailedNotes: [
          'En Past Simple afirmativa usamos la forma de pasado: "-ed" en regulares (played, studied) o la 2ª columna en irregulares (went, bought, saw).',
          'En negativa (DIDN’T) e interrogativa (DID...?) el auxiliar DID ya marca el pasado, así que el verbo principal vuelve a INFINITIVO: "I didn’t go" (¡nunca "I didn’t went"!).',
          'Comparativos: Adjetivos cortos -> "-er than" (taller than, bigger than). Adjetivos largos (2+ sílabas) -> "more ... than" (more beautiful than). Irregulares: good -> better than / the best; bad -> worse than / the worst.',
        ],
        importantFormulas: [
          {
            label: 'Regla del Auxiliar DID',
            formula: '(+) She went to Valencia  |  (-) She didn’t go  |  (?) Did she go?',
            meaning: 'Igual que DOES en presente, DID "roba" el pasado y deja el verbo normal.',
          },
        ],
        memoryTricks: [
          'Si está DID o DIDN’T en la frase, prohibido poner "-ed" o pasado irregular detrás.',
        ],
        studyTips: [
          'Recuerda los adjetivos acabados en "-y" (happy, easy, pretty): aunque tengan dos sílabas, funcionan como cortos cambiando la "y" por "-ier" (happier than, easier than).',
        ],
        trapQuestions: [
          {
            id: 'trap-ing6-1',
            question: 'Corrige el fallo en: "Yesterday we didn’t went to the cinema because it was more cold than Monday."',
            commonMistake: 'Usar "didn’t went" y "more cold".',
            correctApproach: 'Tras "didn’t" el verbo va en infinitivo ("didn’t go"). "Cold" es un adjetivo corto de 1 sílaba, por lo que su comparativo es "colder than".',
            exampleSolution: 'Yesterday we didn’t go to the cinema because it was colder than Monday.',
          },
        ],
        hardQuestions: [
          {
            id: 'hard-ing6-1',
            title: 'Verbo TO BE en pasado (WAS / WERE) no usa DIDN’T',
            statement: '¿Cómo se hace la negativa e interrogativa del verbo To Be en pasado?',
            stepByStep: [
              'Paso 1: I / He / She / It -> WAS (negativa: WASN’T).',
              'Paso 2: You / We / They -> WERE (negativa: WEREN’T).',
              'Paso 3: El verbo To Be es autosuficiente: pregunta "Were you at school?" (nunca "Did you be at school?").',
            ],
            goldenRule: 'To Be (was/were) nunca pide ayuda a DID.',
          },
        ],
        quiz: [
          {
            id: 'q-ing6-1',
            question: 'Complete: "Where _______ you _______ (go) last weekend?"',
            options: ['did / went', 'did / go', 'were / go', 'do / went'],
            correctIndex: 1,
            explanation: 'En preguntas de Past Simple usamos el auxiliar "did" y el verbo principal en infinitivo ("go").',
          },
        ],
        recommendedMinutes: 20,
      },
    ],
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEventItem[] = [
  {
    id: 'ev-1',
    title: 'Ejercicios de Divisiones de 2 cifras y Prueba (Pág. 34)',
    subjectId: SubjectId.MATEMATICAS,
    grade: CourseGrade.FOURTH,
    category: TaskCategory.HOMEWORK,
    date: '2026-10-27',
    time: '17:30',
    durationMinutes: 35,
    completed: false,
    rewardMinutesBonus: 10,
    notes: 'Hacer la prueba D = d × c + r en todas las divisiones del cuaderno.',
  },
  {
    id: 'ev-2',
    title: 'Dictat en Valencià: L’apòstrof i vocabulari del Palància',
    subjectId: SubjectId.VALENCIA,
    grade: CourseGrade.FOURTH,
    category: TaskCategory.STUDY_SESSION,
    date: '2026-10-28',
    time: '18:00',
    durationMinutes: 25,
    completed: false,
    rewardMinutesBonus: 8,
    notes: 'Repassar les excepcions femenines: la universitat, la història, la idea.',
  },
  {
    id: 'ev-3',
    title: 'Control Tema 1: Agudas, Llanas, Esdrújulas y Diptongos',
    subjectId: SubjectId.CASTELLANO,
    grade: CourseGrade.FOURTH,
    category: TaskCategory.EXAM,
    date: '2026-10-29',
    time: '09:30',
    durationMinutes: 45,
    completed: false,
    rewardMinutesBonus: 15,
    notes: 'Repasar la pregunta trampa de examen / exámenes y el método SEGA.',
  },
  {
    id: 'ev-4',
    title: 'Maqueta del curso del río Palancia y la fotosíntesis',
    subjectId: SubjectId.MEDI,
    grade: CourseGrade.FOURTH,
    category: TaskCategory.PROJECT,
    date: '2026-10-30',
    time: '17:00',
    durationMinutes: 40,
    completed: false,
    rewardMinutesBonus: 12,
    notes: 'Rotular curso alto (El Toro), medio (Algimia de Alfara) y bajo (Sagunt).',
  },
  {
    id: 'ev-5',
    title: 'English Quiz: Present Simple vs Present Continuous',
    subjectId: SubjectId.INGLES,
    grade: CourseGrade.FOURTH,
    category: TaskCategory.EXAM,
    date: '2026-11-02',
    time: '11:00',
    durationMinutes: 45,
    completed: false,
    rewardMinutesBonus: 15,
    notes: 'Recordar que DOESN’T se come la -S de tercera persona.',
  },
];

export const SCHOOL_PLATFORMS = [
  {
    id: 'aules-gva',
    name: 'Aules GVA Primària',
    description: 'Entorno virtual de aprendizaje de la Conselleria d’Educació para tareas digitales y recursos de clase.',
    url: 'https://aules.edu.gva.es/primaria/',
    category: 'Aula Virtual Oficial',
  },
  {
    id: 'itaca-familia',
    name: 'ITACA Web Família 2.0',
    description: 'Portal oficial para madres y padres: boletines de notas, asistencia, avisos de tutoría y calendario del CEIP Palancia.',
    url: 'https://familia.edu.gva.es/',
    category: 'Comunicación Madre-Colegio',
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    description: 'Entrega de proyectos colaborativos, fichas interactivas y tablón de anuncios de la tutora.',
    url: 'https://classroom.google.com/',
    category: 'Tareas y Proyectos',
  },
  {
    id: 'ceip-palancia-web',
    name: 'PortalEdu CEIP Palancia (Algimia de Alfara)',
    description: 'Web institucional del colegio: menú de comedor, excursiones, circulares y actividades extraescolares.',
    url: 'https://portal.edu.gva.es/',
    category: 'Web del Centro',
  },
];
