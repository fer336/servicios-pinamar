const baseUrl = 'https://www.serviciospinamar.com';

export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface OfficialLink {
  label: string;
  href: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  date: string;
  readingTime: number;
  lead: string;
  sections: BlogSection[];
  faqs: [string, string][];
  pillarUrl: string;
  pillarLabel: string;
  relatedZoneSlugs?: string[];
  officialLink?: OfficialLink;
  sources?: OfficialLink[];
  imageAlt?: string;
}

export const blogPosts = [
  {
    slug: 'gasista-matriculado',
    title: 'Qué es un gasista matriculado y por qué contratarlo | Blog de Servicios Pinamar',
    description: 'Qué es un gasista matriculado, el rol de ENARGAS, por qué importa la matrícula y cómo verificar la habilitación antes de contratar un trabajo de gas en Pinamar.',
    h1: 'Qué es un gasista matriculado y por qué contratarlo',
    eyebrow: 'Gasista matriculado',
    date: '2026-08-14',
    readingTime: 6,
    lead: 'El gasista matriculado es el profesional habilitado por ENARGAS para trabajar en instalaciones de gas. Te contamos qué implica la matrícula, por qué importa para la seguridad y los trámites, y cómo verificar que el profesional que contratás esté en regla.',
    sections: [
      {
        heading: 'Qué es un gasista matriculado',
        paragraphs: [
          'Un gasista matriculado es un profesional que obtuvo su matrícula ante ENARGAS, el Ente Nacional Regulador del Gas, y que por eso está habilitado para diseñar, instalar, modificar, reparar y revisar instalaciones de gas en viviendas, locales y comercios. La matrícula no es un detalle burocrático: acredita que la persona pasó por la formación y las habilitaciones que la actividad exige, y que responde por el trabajo que realiza.',
          'Las matrículas se otorgan por categorías, y cada categoría define el tipo de instalaciones que el profesional puede realizar. Por eso, cuando un trabajo involucra instalaciones nuevas, ampliaciones o planos para presentar ante el municipio, conviene confirmar que tanto la matrícula como su categoría sean las adecuadas para la tarea.'
        ]
      },
      {
        heading: 'El rol de ENARGAS',
        paragraphs: [
          'ENARGAS es el organismo nacional que regula la actividad del gas en la Argentina: establece las normas técnicas, otorga las matrículas y controla que las instalaciones se realicen según las reglas vigentes. Su regulación se aplica en todo el país, incluidas las propiedades de la costa.',
          'Para el propietario, la consecuencia práctica es simple: una instalación realizada por un gasista matriculado cumple con esa regulación, y una realizada por una persona sin matrícula no tiene respaldo técnico ni legal. Esa diferencia se nota en las habilitaciones municipales, en los seguros y en la seguridad cotidiana de la casa.'
        ]
      },
      {
        heading: 'Por qué la matrícula importa',
        paragraphs: [
          'El gas manejado mal es un riesgo real: pérdidas, artefactos mal ventilados o cañerías con materiales incorrectos pueden provocar accidentes que una instalación bien hecha previene. La matrícula garantiza que quien trabaja sabe cómo se proyecta, se instala y se verifica una instalación segura, y que asume la responsabilidad técnica del trabajo.',
          'Además, la matrícula es requisito en los trámites prácticos: los planos de gas se presentan firmados por un gasista matriculado, los comercios necesitan instalaciones en regla para sus habilitaciones, y las revisiones que piden las aprobaciones municipales se documentan con la credencial del profesional. Sin matrícula, esos trámites no avanzan.',
          'En propiedades que se alquilan o se administran a distancia, el respaldo de un profesional matriculado ordena la relación: el propietario sabe con quién trabaja, qué se hizo y con qué respaldo queda documentado cada trabajo.'
        ]
      },
      {
        heading: 'Cómo verificar la matrícula',
        paragraphs: [
          'Verificar la matrícula es rápido y conviene hacerlo antes de contratar. Se le pide al gasista su número de matrícula y, con ese dato, se puede consultar que la credencial esté vigente y que la categoría habilite el tipo de trabajo. Un profesional en regla entrega su número con naturalidad y puede mostrar su credencial: quien la evita o responde de forma evasiva es una señal de alerta.',
          'También conviene guardar el número junto con el presupuesto. Si el trabajo incluye planos o trámites municipales, ese número es el que va a figurar en la documentación presentada ante Obras Particulares.'
        ]
      },
      {
        heading: 'Checklist para contratar un gasista',
        paragraphs: [
          'Antes de contratar, conviene confirmar: que la matrícula esté vigente y habilite el trabajo; que el presupuesto indique alcance, materiales y tiempos; que el profesional sepa si la obra requiere plano o trámite municipal; que la coordinación sea clara, con visitas, acceso a la propiedad y comunicación definidos; y que el trabajo quede documentado. Con esos cinco puntos, la elección deja de ser una apuesta y pasa a ser una decisión informada.'
        ]
      }
    ],
    faqs: [
      ['¿Qué es un gasista matriculado?', 'Es un profesional habilitado por ENARGAS para instalar, modificar, reparar y revisar instalaciones de gas. Su matrícula acredita la habilitación y la responsabilidad técnica sobre los trabajos que realiza.'],
      ['¿Qué es la matrícula de gasista?', 'Es la credencial emitida por ENARGAS que habilita a un profesional a trabajar en instalaciones de gas. Tiene un número propio y una categoría que define el tipo de instalaciones que puede realizar.'],
      ['¿Cómo verifico que un gasista esté matriculado?', 'Pedile su número de matrícula y verificá que la credencial esté vigente y que su categoría habilite el tipo de trabajo. Un profesional en regla entrega ese dato sin problema y puede mostrar su credencial.'],
      ['¿Puede un gasista matriculado elaborar planos de gas?', 'Sí, cuando su matrícula lo habilita. Los planos de gas se presentan firmados por un gasista matriculado ante Obras Particulares, con responsabilidad técnica de la documentación.']
    ],
    pillarUrl: '/servicios/gas/',
    pillarLabel: 'Gas en Pinamar: instalaciones y revisión de gas',
    relatedZoneSlugs: ['pinamar', 'carilo']
  },
  {
    slug: 'planos-de-gas',
    title: 'Planos de gas: qué son, cuándo se necesitan y cómo se presentan | Blog de Servicios Pinamar',
    description: 'Qué es un plano de gas, en qué casos se necesita, qué normas se aplican (NAG 200, IRAM 4504, escala 1:100) y cómo se presenta ante Obras Particulares de Pinamar.',
    h1: 'Planos de gas: qué son, cuándo se necesitan y cómo se presentan',
    eyebrow: 'Planos de gas',
    date: '2026-09-25',
    readingTime: 6,
    lead: 'El plano de gas es la documentación que acompaña a toda instalación de gas. Te contamos qué representa, en qué casos se necesita, qué normas se aplican y cómo se presenta ante Obras Particulares del municipio.',
    sections: [
      {
        heading: 'Qué es un plano de gas',
        paragraphs: [
          'El plano de gas es el documento técnico que representa la instalación de gas de una propiedad: el trazado de las cañerías, la ubicación de artefactos y puntos de consumo, las ventilaciones y el punto de conexión con el medidor. Cuando la obra modifica una instalación existente, el plano muestra el estado existente y el proyectado, que es justamente lo que las reparticiones municipales necesitan para aprobar el trabajo.',
          'Como toda documentación de obra, el plano acompaña a la instalación en todas sus etapas: sirve para presentar el proyecto, para que la inspección verifique durante la obra que la instalación se hizo como se dibujó, y para la habilitación final.'
        ]
      },
      {
        heading: 'Cuándo se necesita un plano de gas',
        paragraphs: [
          'El caso más común es la obra nueva: toda vivienda o local con instalación de gas necesita su plano para la aprobación municipal. Pero también se pide en las ampliaciones y modificaciones: agregar un artefacto en un ambiente nuevo, sumar un punto de consumo, reubicar cañerías o incorporar una parrilla exterior implica, por lo general, actualizar la documentación.',
          'El tercer caso es la regularización: propiedades que tienen instalaciones hechas sin la documentación correspondiente y que el municipio, un comprador o un seguro les pide poner en orden. En esos casos el plano se elabora relevando la instalación existente, y suele destrabar trámites de hábitat o de venta que estaban frenados.'
        ]
      },
      {
        heading: 'Normas y escala de presentación',
        paragraphs: [
          'Los planos de gas se elaboran según la NAG 200, la norma que regula las instalaciones de gas en edificios y viviendas, y respetan las especificaciones de IRAM 4504 para conductos y ventilación de los artefactos. Esas dos referencias son las que verifican las reparticiones técnicas al recibir la documentación.',
          'La escala habitual de dibujo es 1:100, la escala estándar para la presentación ante Obras Particulares. Con ese nivel de detalle, el plano se puede verificar sobre el terreno durante la obra y en la habilitación final, sin ambigüedades.'
        ]
      },
      {
        heading: 'Cómo se presentan ante Obras Particulares',
        paragraphs: [
          'En Pinamar la presentación se hace ante Obras Particulares del municipio, que concentra buena parte de los trámites en línea a través de tramites.pinamar.gob.ar. Allí se consulta la documentación requerida para cada tipo de obra y se da seguimiento al expediente.',
          'El plano de gas no viaja solo: cuando la obra toca varias instalaciones, suele presentarse junto con los planos sanitarios y de agua corriente como parte del mismo expediente. Elaborar el paquete completo con un mismo responsable técnico evita idas y vueltas y deja los plazos municipales del lado del propietario.'
        ]
      },
      {
        heading: 'Qué necesita preparar el propietario',
        paragraphs: [
          'Para encargar un plano de gas alcanza con reunir lo que esté a mano: datos de la propiedad, planos o croquis previos si existen, fotos de medidor, artefactos y cañerías visibles, y una idea del trabajo proyectado. Con eso el profesional releva lo que falta, en una visita o con coordinación a distancia.',
          'Un punto que simplifica todo: si la obra todavía no arrancó, encargar el plano antes de la construcción permite ajustar la instalación al proyecto aprobado; si la instalación ya está hecha, la documentación se elabora sobre el estado real. En ambos casos el propietario no necesita hacer nada técnico: su parte es reunir la información y mantener el canal de comunicación abierto.'
        ]
      }
    ],
    faqs: [
      ['¿Qué es un plano de gas?', 'Es el documento técnico que representa la instalación de gas de una propiedad: cañerías, artefactos, ventilaciones y punto de conexión con el medidor. Se elabora según NAG 200 e IRAM 4504, en escala 1:100, para presentar ante Obras Particulares.'],
      ['¿Cuándo necesito un plano de gas?', 'En obra nueva, ampliaciones, modificaciones de la instalación y regularizaciones de propiedades construidas sin documentación. Si la obra toca la instalación de gas, lo más probable es que el municipio lo pida.'],
      ['¿Qué normas rigen los planos de gas?', 'La NAG 200, que regula las instalaciones de gas en viviendas y edificios, y la IRAM 4504, para conductos y ventilación de los artefactos. La escala habitual de dibujo es 1:100.'],
      ['¿Dónde se presenta un plano de gas en Pinamar?', 'Ante Obras Particulares del municipio, que concentra los trámites en línea en tramites.pinamar.gob.ar. Cuando la obra toca varias instalaciones, el plano se presenta junto con los sanitarios y de agua corriente.']
    ],
    pillarUrl: '/servicios/planos/',
    pillarLabel: 'Planos de gas, sanitarios y de agua corriente en Pinamar',
    relatedZoneSlugs: ['pinamar', 'ostende'],
    officialLink: { label: 'Trámites de Obras Particulares de Pinamar', href: 'https://tramites.pinamar.gob.ar' }
  },
  {
    slug: 'planos-sanitarios-agua-corriente',
    title: 'Planos sanitarios y bajadas de luz y agua corriente: guía para propietarios | Blog de Servicios Pinamar',
    description: 'Qué son los planos sanitarios y de agua corriente, cuándo se requieren en una obra y quién los firma. Guía para propietarios en Pinamar y la costa.',
    h1: 'Planos sanitarios y bajadas de luz y agua corriente: guía para propietarios',
    eyebrow: 'Planos sanitarios y agua corriente',
    date: '2026-10-23',
    readingTime: 6,
    lead: 'Los planos sanitarios y de agua corriente documentan las instalaciones que la casa usa todos los días. Te explicamos qué es cada uno, cuándo se piden, quién los firma y cómo se presentan en el municipio.',
    sections: [
      {
        heading: 'Qué son los planos sanitarios',
        paragraphs: [
          'El plano sanitario documenta los desagües de la propiedad: los desagües cloacales de baños, cocinas y lavaderos, y los pluviales de techos y patios. El plano indica el recorrido de las cañerías, sus pendientes, los artefactos que descargan en cada tramo, las ventilaciones y el punto de conexión con la red o con la cámara de inspección existente.',
          'Ese nivel de detalle no es formalismo: las pendientes y ventilaciones bien definidas son las que evitan retrolavados, olores y estancamientos cuando la obra está terminada. Por eso el plano se revisa junto con la instalación durante la obra y en la habilitación final.'
        ]
      },
      {
        heading: 'Qué son los planos de agua corriente y las bajadas de luz y agua corriente',
        paragraphs: [
          'El plano de agua corriente documenta la alimentación de la propiedad: el recorrido desde el medidor, la bajada de agua corriente, la distribución de cañerías y la ubicación de los puntos de consumo, con sus diámetros según la cantidad de artefactos que abastecen.',
          'En la costa es común que esta documentación se agrupe con la bajada de luz: ambas instalaciones comparten los espacios de paso y buena parte de los trámites municipales. Cuando en una obra se habla de "bajadas de luz y agua corriente", se hace referencia a esos planos que documentan las alimentaciones de la propiedad desde la red.'
        ]
      },
      {
        heading: 'Cuándo se requieren',
        paragraphs: [
          'Se requieren en la obra nueva, que con baños, cocina o lavadero necesita su documentación, y en las ampliaciones y refacciones que modifican los desagües o la distribución de agua. Agregar un baño, ampliar una cocina o sumar un lavadero son cambios que, casi siempre, actualizan estos planos.',
          'También aparecen en las regularizaciones: propiedades construidas sin documentación que necesitan poner sus instalaciones en regla para trámites de hábitat, venta o alquiler. En esos casos el plano se elabora relevando lo existente, sin necesidad de obra nueva.',
          'Cuando la obra toca varias instalaciones, la documentación suele presentarse como un paquete completo ante el municipio, elaborado por el mismo responsable técnico.'
        ]
      },
      {
        heading: 'Quién los elabora y firma',
        paragraphs: [
          'Los planos sanitarios y de agua corriente los elabora y firma un profesional con responsabilidad técnica: en este caso, un gasista matriculado que además actúa como plomero encargado, con responsabilidad real sobre la documentación presentada. Esa firma es lo que le da valor al plano ante el municipio, el comprador o el seguro.',
          'Para el propietario, la firma significa que alguien responde por la documentación: si algo no se corresponde con la instalación real, el responsable lo corrige. Por eso conviene encargar los planos a quien pueda relevar la obra y acompañar la presentación, y no a plantillas sin respaldo.'
        ]
      },
      {
        heading: 'La presentación en el municipio',
        paragraphs: [
          'En Pinamar los planos se presentan ante Obras Particulares, que concentra los trámites en línea en tramites.pinamar.gob.ar. El municipio verifica que la documentación cumpla con las normas y que la instalación proyectada sea coherente con la obra declarada.',
          'La elaboración de estos planos se coordina con fotos, planos previos o visitas puntuales, y el propietario recibe orientación para la presentación y el seguimiento del expediente, incluso cuando la propiedad se administra a distancia.'
        ]
      }
    ],
    faqs: [
      ['¿Qué son los planos sanitarios?', 'Documentan los desagües cloacales y pluviales de la propiedad: cañerías, pendientes, ventilaciones y punto de conexión con la red. Se piden en obras nuevas, ampliaciones, refacciones y regularizaciones.'],
      ['¿Qué son las bajadas de luz y agua corriente?', 'La bajada de agua corriente alimenta la red interior desde el medidor, y la bajada de luz hace lo propio con la instalación eléctrica. Sus planos documentan esas alimentaciones para la presentación ante Obras Particulares.'],
      ['¿Cuándo necesito planos sanitarios o de agua corriente?', 'En obra nueva, ampliaciones, refacciones que modifican desagües o distribución de agua, y regularizaciones de propiedades sin documentación. Si la obra agrega un baño o cambia una cocina, seguramente los necesita.'],
      ['¿Quién puede firmar estos planos?', 'Un profesional con responsabilidad técnica: en este caso un gasista matriculado que actúa como plomero encargado. Su firma respalda la documentación ante el municipio y en los trámites de la propiedad.']
    ],
    pillarUrl: '/servicios/planos/',
    pillarLabel: 'Planos de gas, sanitarios y de agua corriente en Pinamar',
    relatedZoneSlugs: ['pinamar', 'valeria-del-mar'],
    officialLink: { label: 'Trámites de Obras Particulares de Pinamar', href: 'https://tramites.pinamar.gob.ar' }
  },
  {
    slug: 'elegir-pintor-pinamar',
    title: 'Cómo elegir un pintor en Pinamar: salitre, humedad y preparación de superficies | Blog de Servicios Pinamar',
    description: 'Cómo elegir un pintor en Pinamar: el clima costero como diferenciador, por qué la preparación de superficies define el resultado y qué preguntar antes de contratar.',
    h1: 'Cómo elegir un pintor en Pinamar: salitre, humedad y preparación de superficies',
    eyebrow: 'Pintura en la costa',
    date: '2026-11-20',
    readingTime: 5,
    lead: 'En la costa la pintura tiene reglas propias: salitre, humedad, sol y viento. Te contamos cómo elegir un pintor en Pinamar mirando lo que realmente define el resultado: la preparación de superficies.',
    sections: [
      {
        heading: 'El clima costero cambia el trabajo de pintura',
        paragraphs: [
          'Las propiedades de Pinamar, Cariló, Valeria del Mar y Ostende viven en un ambiente hostil para las superficies pintadas: el salitre del mar, la humedad de los meses de invierno, el sol fuerte del verano y el viento constante atacan frentes, aberturas, decks y maderas mucho más que en el interior del país.',
          'En las localidades forestadas hay un factor extra: la sombra de los pinos mantiene la humedad sobre muros y techos y favorece el verdín y el musgo. Un pintor que no conoce ese contexto propone un trabajo estándar; uno que trabaja la costa sabe qué productos y qué preparación exige cada superficie según su exposición.'
        ]
      },
      {
        heading: 'La preparación de superficies importa más que la pintura',
        paragraphs: [
          'El error más común es pensar que la calidad de un trabajo de pintura está en la marca de la pintura. En la costa, el resultado lo define la preparación: limpieza y secado de la superficie, lijado, reparación de grietas y desprendimientos, tratamiento de maderas con humedad o salitre y, cuando corresponde, una base o primario adecuado.',
          'Una superficie mal preparada despega la pintura en meses, por muy buena que sea. Un buen pintor dedica la mayor parte del tiempo y del presupuesto a esta etapa, y lo dice antes de empezar: sabe indicar qué superficies requieren lijado general, cuáles necesitan reparación previa y cuáles conviene reemplazar.'
        ]
      },
      {
        heading: 'Qué preguntar antes de contratar',
        paragraphs: [
          'Antes de contratar, conviene preguntar cuatro cosas concretas: qué materiales va a usar y por qué son adecuados para el clima costero; cuál es el proceso de preparación previo, con lijado, limpieza y tratamiento; cuánto va a durar el trabajo y con qué frecuencia se puede inspeccionar; y qué cubre la garantía o las retomas luego de la entrega.',
          'También vale preguntar por la coordinación: si la propiedad está cerrada o se administra a distancia, quién se ocupa del acceso, de los materiales y de mantener informado al propietario durante el trabajo. Las respuestas claras a esas preguntas separan un trabajo ordenado de uno improvisado.'
        ]
      },
      {
        heading: 'Cuándo conviene pintar en la costa',
        paragraphs: [
          'En la costa la mejor ventana para pintar exteriores es entre septiembre y noviembre: la temperatura ya subió, las lluvias son menos frecuentes que en invierno y la temporada alta todavía no arrancó, así que hay disponibilidad de fechas y los frentes pueden secar bien antes de diciembre.',
          'Pintar en plena temporada o en meses de lluvias se puede, pero exige más planificación y más cuidado con los tiempos de secado. Por eso los propietarios que coordinan a distancia suelen programar los trabajos de exterior en esa ventana y dejar los interiores para cualquier momento del año.'
        ]
      },
      {
        heading: 'Señales de alerta',
        paragraphs: [
          'Algunas señales conviene tomarlas como banderas rojas: un precio muy inferior al de otros presupuestos sin que nadie haya visto la superficie; un presupuesto que no menciona la preparación; la promesa de pintar directo en exteriores castigados por el salitre; plazos vagos; y la dificultad para responder qué cubre la garantía.',
          'También es alerta que no quiera coordinar el alcance por escrito o por WhatsApp. En la costa muchas propiedades se administran a distancia, y un trabajo serio se documenta, con fotos del avance e indicaciones de mantenimiento al entregar.'
        ]
      }
    ],
    faqs: [
      ['¿Por qué la pintura exterior se despega rápido en Pinamar?', 'Por el clima costero: salitre, humedad, sol y viento atacan las superficies. Si la preparación previa fue insuficiente, la pintura se despega a los meses aunque sea de buena calidad.'],
      ['¿Qué preparación necesita una superficie antes de pintar?', 'Limpieza y secado, lijado, reparación de grietas o desprendimientos, tratamiento de maderas con humedad o salitre y, cuando corresponde, una base o primario. La preparación define cuánto dura la pintura.'],
      ['¿Cuál es la mejor época para pintar en la costa?', 'Entre septiembre y noviembre: temperaturas en ascenso, menos lluvias que en invierno y disponibilidad de fechas antes de la temporada alta. Es la ventana ideal para los exteriores.'],
      ['¿Qué preguntas conviene hacer antes de contratar un pintor?', 'Qué materiales usa y por qué, cómo prepara las superficies, cuánto dura el trabajo, qué cubre la garantía y cómo se coordina si la propiedad está cerrada o a distancia.']
    ],
    pillarUrl: '/servicios/pintura/',
    pillarLabel: 'Pintura en Pinamar: pintores para casas y locales',
    relatedZoneSlugs: ['pinamar', 'carilo']
  },
  {
    slug: 'mosquitos-pinamar-cuando-fumigar',
    title: 'Mosquitos en Pinamar: cuándo conviene fumigar y qué hacer antes | Blog de Servicios Pinamar',
    description: 'Mosquitos en Pinamar: por qué llegan en olas después de las lluvias, cómo eliminar criaderos en tu casa y cuándo tiene sentido fumigar el jardín.',
    h1: 'Mosquitos en Pinamar: cuándo conviene fumigar y qué hacer antes',
    eyebrow: 'Fumigación de mosquitos',
    date: '2026-11-19',
    readingTime: 5,
    lead: 'En Pinamar los mosquitos suelen llegar en olas, después de varios días de lluvia. Te contamos qué explicaron las autoridades sanitarias, qué podés hacer en tu casa para que haya menos y en qué casos tiene sentido fumigar el jardín.',
    sections: [
      {
        heading: 'Por qué llegan en olas después de la lluvia',
        paragraphs: [
          'En febrero de 2021, durante una invasión de mosquitos que se hizo noticia en todo el país, el responsable del área de Zoonosis de Pinamar explicó a La Nación que estas olas aparecen después de lluvias "no tanto abundantes, pero sí continuas", y estimó que cada ola dura alrededor de una semana.',
          'En esa misma nota aclaró que la especie que causaba la molestia no tenía riesgos para la salud y que "nada tiene que ver con el que propaga el dengue". También explicó que el municipio no hizo fumigaciones masivas porque podían causar "un importante impacto ambiental", y que el control se concentró en lugares puntuales con mucha circulación de gente.'
        ]
      },
      {
        heading: 'Lo primero: eliminar los criaderos',
        paragraphs: [
          'El Ministerio de Salud de la Provincia de Buenos Aires resume la prevención en cuatro acciones: "Tapá, lavá, tirá y girá". Tapar los tanques, tachos y depósitos que están a la intemperie; lavar con cepillo o esponja los recipientes, canaletas y desagües para desprender los huevos; tirar los recipientes en desuso; y dar vuelta los objetos que juntan agua cada vez que llueve, como baldes o portamacetas.',
          'Según el mismo ministerio, el mosquito Aedes aegypti, el que transmite el dengue, pone sus huevos en objetos que acumulan agua, y las larvas pueden convertirse en mosquitos en menos de 10 días. Por eso recomienda descacharrar todo el año: los huevos permanecen latentes aun en los meses fríos. Pinamar participó de las jornadas provinciales de descacharrado de octubre de 2024, con promotores que recorrieron los barrios casa por casa.'
        ]
      },
      {
        heading: 'Qué puede hacer una fumigación en el jardín',
        paragraphs: [
          'Una fumigación del jardín actúa sobre los mosquitos que hay en ese momento en el pasto, los cercos y las zonas húmedas donde se refugian. Lo que no hace es quitar el agua estancada: si en el patio quedan recipientes con agua, en pocos días vuelve a haber mosquitos nuevos.',
          'Por eso conviene pensarla como un complemento, nunca como reemplazo del descacharrado. Lo más efectivo es revisar primero el jardín, eliminar los criaderos y recién después fumigar. Así el tratamiento rinde más.'
        ]
      },
      {
        heading: 'Cuándo tiene sentido fumigar',
        paragraphs: [
          'Los casos más habituales en la costa son tres: antes de un evento o una reunión al aire libre, antes de recibir inquilinos en una casa que estuvo cerrada, y durante una ola fuerte que no deja usar el jardín. En todos conviene coordinar la fumigación junto con una recorrida para eliminar criaderos.',
          'Si tenés chicos o mascotas, pedile al profesional que te indique qué producto va a usar, cuánto tiempo hay que esperar para volver a usar el jardín y qué conviene guardar o tapar antes de la aplicación.'
        ]
      },
      {
        heading: 'Si aparecen síntomas o sospechás dengue',
        paragraphs: [
          'Una fumigación particular no reemplaza las acciones de salud pública. Ante fiebre u otros síntomas, consultá en un centro de salud. La Provincia de Buenos Aires publica información actualizada sobre dengue en gba.gob.ar/dengue y atiende consultas en la línea 148.'
        ]
      }
    ],
    faqs: [
      ['¿Por qué hay tantos mosquitos en Pinamar después de las lluvias?', 'Según explicó el área de Zoonosis de Pinamar en 2021, las olas de mosquitos aparecen después de lluvias continuas y suelen durar alrededor de una semana.'],
      ['¿Qué es lo más efectivo para tener menos mosquitos en casa?', 'Eliminar los criaderos: tapar, lavar, tirar y dar vuelta los recipientes que juntan agua, como recomienda el Ministerio de Salud bonaerense.'],
      ['¿Sirve fumigar el jardín?', 'Sirve para bajar la cantidad de mosquitos en un momento puntual, como antes de un evento. Si quedan recipientes con agua, vuelven a aparecer: por eso se combina con el descacharrado.'],
      ['¿Hacen fumigación de mosquitos en Pinamar?', 'Sí. Te conectamos con un profesional que fumiga jardines, patios y exteriores, y entrega un certificado del trabajo realizado.']
    ],
    pillarUrl: '/servicios/fumigaciones/',
    pillarLabel: 'Fumigación en Pinamar: mosquitos, plagas y murciélagos',
    relatedZoneSlugs: ['pinamar', 'carilo'],
    sources: [
      { label: 'La Nación (24/02/2021): ¿Por qué volvieron los mosquitos a invadir Pinamar?', href: 'https://www.lanacion.com.ar/sociedad/temporada-por-que-volvieron-los-mosquitos-a-invadir-pinamar-nid24022021/' },
      { label: 'Ministerio de Salud de la Provincia de Buenos Aires (25/10/2024): jornadas de descacharrado en todos los municipios', href: 'https://www.gba.gob.ar/saludprovincia/noticias/la_provincia_realiza_jornadas_de_descacharrado_en_todos_los_municipios' },
      { label: 'Contexto Pinamar (28/10/2024): Pinamar se suma a la campaña provincial de prevención del dengue', href: 'https://contextopinamar.com/pinamar-prevencion-dengue/' }
    ]
  },
  {
    slug: 'permiso-poda-pinos-pinamar',
    title: '¿Hace falta permiso para podar o talar un pino en Pinamar? | Blog de Servicios Pinamar',
    description: 'Sí: en el Partido de Pinamar la poda y la extracción de árboles requieren autorización. Qué dice el Decreto 1292/2024, quién la emite y qué cambia en Cariló.',
    h1: '¿Hace falta permiso para podar o talar un pino en Pinamar?',
    eyebrow: 'Poda de pinos',
    date: '2026-11-19',
    readingTime: 5,
    lead: 'Sí. En el Partido de Pinamar las podas y extracciones de árboles necesitan autorización municipal, también dentro de un lote privado. Te contamos qué dice la norma vigente, quién otorga el permiso y qué tener en cuenta antes de contratar a un podador.',
    sections: [
      {
        heading: 'La respuesta corta: sí, hace falta autorización',
        paragraphs: [
          'El Decreto 1292/2024 de la Municipalidad de Pinamar, del 19 de junio de 2024, lo dice sin vueltas: "Las extracciones y podas de árboles en el Partido de Pinamar deberán contar con la autorización correspondiente". Y agrega: "En ningún caso se podrá realizar el trabajo sin la autorización."',
          'El Partido de Pinamar incluye a Pinamar, Ostende, Valeria del Mar y Cariló, así que la regla vale para todas esas localidades.'
        ]
      },
      {
        heading: 'Quién otorga el permiso',
        paragraphs: [
          'Según el mismo decreto, cuando el árbol está en el espacio público la autorización la emite el Ingeniero Forestal del Vivero Municipal. Cuando está en un lote privado, la emite la Dirección de Obras Particulares.',
          'Si la extracción forma parte de una obra, el sitio de Obras Particulares de la Municipalidad publica un modelo de nota para pedir el permiso. La firma el propietario o el profesional a cargo de la obra, e indica la parcela, la cantidad de árboles a extraer y las especies que se van a plantar para reponerlos.'
        ]
      },
      {
        heading: 'Reposición de árboles y el límite en Cariló',
        paragraphs: [
          'El modelo de nota municipal pide comprometerse a reponer los árboles extraídos, priorizando especies nativas argentinas. Como ejemplo menciona jacarandá, ceibo, aguaribay, timbó, butiá yatay, palo borracho, sauce criollo (Salix humboldtiana) y pindó, en envases de 20 litros.',
          'En Cariló hay un límite adicional: según ese mismo modelo, no se puede pedir la extracción de más del 25 % del total de árboles existentes en el terreno.'
        ]
      },
      {
        heading: 'El podador también tiene que estar registrado',
        paragraphs: [
          'El Decreto 1292/2024 reglamenta el Registro Municipal de Jardineros, Podadores, Parqueros y Afines. La inscripción es obligatoria para cualquier persona o empresa que preste servicios de jardinería, poda, desmonte o extracción de árboles en el Partido de Pinamar, y se hace en línea desde el sitio del municipio.',
          'Al inscribirse, el prestador declara que conoce las normas y se compromete a transmitirlas a sus clientes. Las sanciones van desde un apercibimiento y multas según el Código Municipal de Faltas hasta la suspensión del registro por 30 días ante una segunda multa y la exclusión definitiva ante una tercera.'
        ]
      },
      {
        heading: 'Qué pasa con los restos de poda',
        paragraphs: [
          'El decreto también regula los residuos. Los restos de podas pesadas y talas deben llevarse al Predio de Disposición Final de la Ruta 11, km 405,5. Los restos de poda liviana que superen los límites permitidos los tiene que llevar el prestador a los puntos verdes habilitados.'
        ]
      },
      {
        heading: 'Antes de contratar',
        paragraphs: [
          'Antes de empezar, pedile al profesional que te confirme que está inscripto en el registro municipal y que el trabajo cuenta con la autorización. Preguntale también adónde va a llevar los restos de poda.',
          'Las normas municipales pueden cambiar. Para un caso concreto, confirmá los requisitos vigentes en la Dirección de Obras Particulares de la Municipalidad de Pinamar.'
        ]
      }
    ],
    faqs: [
      ['¿Necesito permiso para podar un pino en mi terreno en Pinamar?', 'Sí. El Decreto 1292/2024 establece que las podas y extracciones de árboles en el Partido de Pinamar necesitan autorización. En un lote privado la emite la Dirección de Obras Particulares.'],
      ['¿Cuántos árboles se pueden extraer en Cariló?', 'Según el modelo de nota de la Municipalidad para pedir la extracción en obra, en Cariló no se puede pedir más del 25 % del total de árboles existentes en el terreno.'],
      ['¿Hay que reponer los árboles que se sacan?', 'El modelo de nota municipal pide indicar las especies con las que se van a reponer, priorizando especies nativas argentinas.'],
      ['¿El podador tiene que estar registrado?', 'Sí. Quien preste servicios de poda, tala o extracción en el Partido de Pinamar debe estar inscripto en el Registro Municipal de Jardineros, Podadores, Parqueros y Afines.']
    ],
    pillarUrl: '/servicios/jardineria/',
    pillarLabel: 'Poda de pinos en Pinamar: tala, jardinería y parquización',
    relatedZoneSlugs: ['pinamar', 'carilo'],
    officialLink: { label: 'Dirección de Obras Particulares · Municipalidad de Pinamar', href: 'https://pinamar.gob.ar/obras-particulares/' },
    sources: [
      { label: 'Boletín Oficial Municipal de Pinamar: Decreto 1292/2024 (Registro de Jardineros, Podadores, Parqueros y Afines)', href: 'https://sibom.slyt.gba.gob.ar/bulletins/11980/contents/2155056' },
      { label: 'Municipalidad de Pinamar: modelo de nota "Permiso para extracción de árboles" en obra', href: 'https://pinamar.gob.ar/wp-content/uploads/Como-solicitar-extraccion-de-arboles-en-obra.docx' },
      { label: 'Municipalidad de Pinamar: Dirección de Obras Particulares', href: 'https://pinamar.gob.ar/obras-particulares/' }
    ]
  }
] as const;

export type BlogPostEntry = (typeof blogPosts)[number];

export const getBlogUrl = (slug: string) => `${baseUrl}/blog/${slug}/`;

export const getBlogPostBySlug = (slug: string) => blogPosts.find((post) => post.slug === slug);
