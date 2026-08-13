const baseUrl = 'https://www.serviciospinamar.com';

export interface ZoneLink {
  label: string;
  href: string;
}

export interface Zone {
  slug: string;
  name: string;
  teaser: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  lead: string;
  neighborhoods: string[];
  services: string[];
  body: string[];
  faqs?: [string, string][];
}

export const zones = [
  {
    slug: 'pinamar',
    name: 'Pinamar',
    teaser: 'Mantenimiento, pintura, hidrolavado, plomería, gas y planos para propiedades en Pinamar, con coordinación por WhatsApp durante todo el año.',
    title: 'Servicios de Mantenimiento en Pinamar | Pintura, Plomería, Gas y Planos | Servicios Pinamar',
    description: 'Pintores, plomeros, gasista matriculado, hidrolavado y planos en Pinamar. Mantenimiento de casas, departamentos y locales con coordinación por WhatsApp.',
    h1: 'Servicios de mantenimiento y planos en Pinamar',
    eyebrow: 'Zona de cobertura · Pinamar',
    lead: 'Trabajamos en propiedades de Pinamar: pintura, hidrolavado, plomería, gas y planos para casas, departamentos, locales y comercios, con coordinación clara por WhatsApp para propietarios, inmobiliarias y administradores.',
    neighborhoods: ['Centro (Av. Bunge)', 'Av. Shaw', 'Pinamar Norte', 'Bajadas públicas al mar'],
    services: ['pintura', 'plomeria', 'gas', 'planos', 'hidrolavado'],
    body: [
      'Pinamar concentra la mayor parte de las propiedades atendidas por el servicio: casas de uso permanente, departamentos de alquiler temporario, locales comerciales sobre Avenida Bunge y edificios de departamentos que trabajan todo el año. Esa mezcla hace que los trabajos varíen mucho entre una semana y otra: acá se pide desde repintar un frente antes de temporada hasta regularizar la documentación de gas de una propiedad que estuvo años cerrada.',
      'Las casas alrededor del centro y de la Av. Shaw comparten problemas típicos del ambiente costero: el sol y el salitre atacan las maderas y las pinturas exteriores, la arena se acumula en veredas, decks y patios, y la humedad de los meses de invierno aparece como manchas en paredes y cielorrasos. Por eso el hidrolavado y la pintura de mantenimiento son los trabajos que más se repiten en Pinamar fuera de temporada, cuando los precios y los tiempos son mejores para el propietario.',
      'En las propiedades de alquiler temporario, el ciclo es siempre el mismo: antes de cada temporada hay que revisar plomería y gas, reparar griferías, verificar artefactos y dejar los exteriores presentables. Muchas veces todo eso se coordina a distancia, con fotos y videos por WhatsApp, porque el propietario o la inmobiliaria no está en la ciudad. Para esos casos el servicio incluye relevamiento con registro fotográfico del avance y comunicación directa durante cada trabajo.',
      'Las propiedades nuevas o en refacción en Pinamar Norte y en las zonas de expansión suelen necesitar planos: planos de gas para la aprobación de la instalación, planos sanitarios de desagües cloacales y pluviales, y planos de agua corriente con las bajadas de luz y agua corriente. Esa documentación se elabora con firma de gasista matriculado y se presenta ante Obras Particulares del municipio.',
      'Los frentes de locales sobre Avenida Bunge y las calles comerciales tienen otra dinámica: los trabajos se hacen con el comercio abierto o en horarios acotados, y por eso la coordinación previa del alcance es clave. Se repintan frentes, se resuelven pérdidas en baños o cocinas comerciales y se revisan instalaciones de gas antes de habilitaciones o auditorías.',
      'El mantenimiento en Pinamar también incluye la preparación para estancias: propietarios que vienen solo en enero y quieren la casa lista, casas que permanecen cerradas varios meses y necesitan revisión de instalaciones antes de volver a usarse, y propiedades que se ponen en alquiler por primera vez y requieren puesta a punto completa. En todos esos casos se puede coordinar por WhatsApp sin necesidad de que el propietario esté presente.',
      'Para la temporada alta, recomendamos encargar los trabajos entre septiembre y noviembre, cuando todavía hay disponibilidad de fechas y el clima permite pintura y trabajos de exterior. Durante diciembre y enero los trabajos siguen pero se planifican con más anticipación, especialmente las pinturas completas y las reparaciones que requieren cortes de agua o de gas en el edificio.',
      'Comprometer tiempos reales y respetarlos es parte del trabajo: cada tarea en Pinamar empieza con un alcance acordado, materiales definidos y un canal de comunicación directo, para que un propietario que está a kilómetros de distancia sepa exactamente qué se hizo, qué falta y cuándo se termina.'
    ],
    faqs: [
      ['¿Realizan mantenimiento de propiedades en Pinamar durante todo el año?', 'Sí. Trabajamos en Pinamar todo el año, con más actividad de exteriores y pintura fuera de temporada y trabajos coordinados de revisión antes de cada temporada.'],
      ['¿Atienden propiedades de alquiler temporario en Pinamar?', 'Sí. Coordinamos puesta a punto de propiedades de alquiler temporario con propietarios e inmobiliarias, con fotos del avance por WhatsApp.'],
      ['¿Pueden presentar planos ante Obras Particulares de Pinamar?', 'Sí. Elaboramos planos de gas, sanitarios y de agua corriente con firma de gasista matriculado y te orientamos en la presentación municipal.']
    ]
  },
  {
    slug: 'carilo',
    name: 'Cariló',
    teaser: 'Mantenimiento de casas en Cariló: pintura, plomería, gas, hidrolavado y planos para propiedades forestadas, con coordinación a distancia.',
    title: 'Servicios de Mantenimiento en Cariló | Pintura, Plomería, Gas y Planos | Servicios Pinamar',
    description: 'Pintores, plomeros, gasista matriculado, hidrolavado y planos en Cariló. Mantenimiento de casas forestadas y propiedades de uso estacional.',
    h1: 'Servicios de mantenimiento y planos en Cariló',
    eyebrow: 'Zona de cobertura · Cariló',
    lead: 'Pintura, hidrolavado, plomería, gas y planos para casas y propiedades en Cariló, con coordinación a distancia para propietarios, administradores e inmobiliarias.',
    neighborhoods: ['Av. Divisadero', 'Bosque de Cariló', 'Casco forestado', 'Playas de Cariló'],
    services: ['pintura', 'gas', 'planos', 'plomeria', 'hidrolavado'],
    body: [
      'Cariló es una localidad forestada donde la mayoría de las casas están rodeadas de pinos, y eso cambia el tipo de mantenimiento que necesita cada propiedad. Las copas de los árboles mantienen la humedad sobre techos y muros, las agujas de pino se acumulan en canaletas, decks y veredas, y las superficies exteriores rara vez reciben sol directo, lo que favorece la aparición de verdín y musgo. El hidrolavado en Cariló se hace habitualmente bajo los árboles y no solo en fachadas: patios, decks de madera, entradas y zonas de parrilla son los puntos que más se limpian antes de cada estadía.',
      'El perfil de las propiedades de Cariló también es distinto al del resto de la costa: casas de un nivel o dos, muchas con mucho terreno, uso estacional concentrado en verano y Semana Santa, y un grueso de propietarios que administran desde Buenos Aires o desde el exterior. Eso hace que la coordinación a distancia sea la regla: fotos y videos de cada trabajo, alcance cerrado por WhatsApp y seguimiento con registro del avance mientras la casa permanece cerrada.',
      'Las pinturas en Cariló requieren atención especial en maderas y terminaciones expuestas: aleros, decks, cercos y aberturas padecen la humedad constante del bosque. Por eso antes de pintar se evalúa el estado de cada superficie y se define si hace falta lijado, tratamiento o reemplazo puntual de piezas, para que la pintura no vuelva a despegarse a los meses.',
      'La instalación de gas de las casas de Cariló se revisa al abrir la temporada y al cerrar la propiedad: se verifican artefactos que estuvieron apagados meses, conexiones expuestas a la humedad y puntos de consumo en parrillas y calefactores exteriores. Cuando una casa se reforma o amplía, el trabajo se complementa con la elaboración de planos de gas y sanitarios para la presentación municipal.',
      'Las calles de arena del casco forestado condicionan la logística: hay trabajos que se coordinan con acceso vehicular limitado y horarios definidos, y eso se contempla desde el alcance inicial. Entregas de materiales, turnos y visitas se planifican en función del acceso de cada propiedad, algo que un propietario a distancia no siempre tiene en cuenta y que nosotros resolvemos en la coordinación.',
      'La temporada en Cariló arranca antes que en otras localidades: las casas se ocupan desde mediados de diciembre y muchos propietarios piden la puesta a punto completa entre octubre y noviembre, incluida la revisión de plomería, el hidrolavado de patios y decks y la pintura de mantenimiento de los frentes que dañó el invierno.',
      'En propiedades forestadas, la revisión de plomería también incluye un punto particular: las raíces y la acumulación de hojas en desagües de patios y terrazas. La limpieza de rejillas y el control de pendientes en cañerías exteriores se suman a la revisión general cuando la casa estuvo mucho tiempo cerrada.',
      'Trabajar en Cariló implica respetar el carácter del lugar: propiedades silenciosas, vecinos presentes solo en ciertas semanas del año y una exigencia de prolijidad muy alta en cada intervención. El trabajo se deja documentado con fotos antes y después, y la entrega siempre se hace con indicaciones de mantenimiento para la próxima temporada.'
    ],
    faqs: [
      ['¿Coordinan trabajos a distancia en Cariló?', 'Sí. La mayoría de los propietarios de Cariló administra sus casas a distancia: coordinamos por WhatsApp con fotos y videos del avance de cada trabajo.'],
      ['¿El mantenimiento de casas forestadas es distinto?', 'Sí. La humedad del bosque afecta pinturas, maderas y superficies exteriores, y la acumulación de agujas de pino exige limpieza de canaletas y decks más seguido.'],
      ['¿Pueden revisar gas y plomería antes de la temporada?', 'Sí. Realizamos revisiones de gas y plomería al abrir y cerrar la propiedad, y puesta a punto completa antes de la temporada.']
    ]
  },
  {
    slug: 'valeria-del-mar',
    name: 'Valeria del Mar',
    teaser: 'Pintura, hidrolavado, plomería, gas y planos en Valeria del Mar. Mantenimiento de casas y departamentos con coordinación por WhatsApp.',
    title: 'Servicios de Mantenimiento en Valeria del Mar | Pintura, Plomería, Gas y Planos | Servicios Pinamar',
    description: 'Pintores, plomeros, gasista matriculado, hidrolavado y planos en Valeria del Mar. Mantenimiento de casas y departamentos de la costa.',
    h1: 'Servicios de mantenimiento y planos en Valeria del Mar',
    eyebrow: 'Zona de cobertura · Valeria del Mar',
    lead: 'Trabajos de pintura, hidrolavado, plomería, gas y planos en Valeria del Mar, para casas, departamentos y locales con coordinación clara por WhatsApp.',
    neighborhoods: ['Casco de Valeria', 'Playa de Valeria', 'Forestación costera', 'Accesos desde la Av. Shaw'],
    services: ['plomeria', 'pintura', 'hidrolavado', 'gas', 'planos'],
    body: [
      'Valeria del Mar es la localidad más chica de las cuatro que cubre el servicio, con un casco forestado entre Cariló y Ostende y un perfil tranquilo que se sostiene fuera de temporada. La mayoría de las propiedades son casas bajas y departamentos de pocas plantas, muchas con uso familiar y rotación de alquiler durante el verano. Esa escala hace que los trabajos sean más puntuales que en Pinamar: puesta a punto de departamentos, reparaciones de griferías y pérdidas, y mantenimiento de exteriores de casas.',
      'La humedad de las casas forestadas de Valeria se nota sobre todo en paredes y cielorrasos después del invierno, cuando las viviendas estuvieron cerradas. La pintura de mantenimiento es el trabajo más pedido, casi siempre combinado con la reparación previa de las superficies: se corrige el daño, se limpia y se pinta con productos que aguanten el ambiente costero y la sombra de los pinos.',
      'Los departamentos de alquiler de Valeria del Mar concentran las consultas de plomería: griferías que gotean, pérdidas debajo de bachas, mangueras de lavarropas viejas y tanques que necesitan revisión antes de cada temporada. Son reparaciones chicas que, resueltas a tiempo, evitan reclamos y arreglos grandes en pleno verano.',
      'La coordinación por WhatsApp tiene un rol central en Valeria porque buena parte de las propiedades se usa solo en vacaciones: el propietario no está, la inmobiliaria tiene diez propiedades más que administrar y el trabajador necesita acceso a la vivienda. Para esos casos se coordina entrega y recibo de llaves, y el avance se registra con fotos para que el dueño vea cada paso del trabajo sin estar presente.',
      'Las casas de Valeria con jardín y parrilla suman el hidrolavado de patios y decks al ciclo de mantenimiento previo a la temporada, junto con la limpieza de frentes que la humedad y las agujas de pino ensucian durante el año. En casas de dos pisos se incluye la revisión de canaletas y la limpieza de techos cuando la acumulación de hojas tapó los desagües.',
      'Cuando una propiedad de Valeria se reforma o se pone a la venta, el paquete de documentación suele ser completo: planos de gas, planos sanitarios y planos de agua corriente con las bajadas de luz y agua corriente. La documentación se elabora con firma de gasista matriculado y se acompaña la presentación ante Obras Particulares.',
      'La temporada en Valeria del Mar es más corta pero intensa: el grueso de los alquileres se concentra en enero y febrero, y los trabajos se planifican entre septiembre y diciembre. Para los propietarios que vienen solo algunas semanas al año, el consejo es encargar la revisión de instalaciones junto con la puesta a punto, en una sola visita, para aprovechar al máximo cada coordinación.',
      'El trabajo en Valeria se caracteriza por la cercanía: al ser una localidad chica, los tiempos de respuesta son cortos y el conocimiento de cada propiedad se acumula visita a visita. Es común volver a la misma casa cada temporada para hacer la puesta a punto, y ese historial hace que cada nuevo trabajo sea más rápido y más preciso.'
    ],
    faqs: [
      ['¿Trabajan en departamentos de alquiler de Valeria del Mar?', 'Sí. Hacemos puesta a punto de departamentos de alquiler: plomería, griferías, revisión de gas y pintura de mantenimiento antes de cada temporada.'],
      ['¿Cómo coordinan si el propietario no está en Valeria?', 'Por WhatsApp: enviamos fotos y videos del avance y coordinamos el acceso a la propiedad con el propietario o la inmobiliaria.'],
      ['¿Elaboran planos para reformas en Valeria?', 'Sí. Elaboramos planos de gas, sanitarios y de agua corriente con firma de gasista matriculado y orientamos la presentación municipal.']
    ]
  },
  {
    slug: 'ostende',
    name: 'Ostende',
    teaser: 'Mantenimiento en Ostende: pintura, plomería, gas, hidrolavado y planos para casas y comercios, con coordinación por WhatsApp.',
    title: 'Servicios de Mantenimiento en Ostende | Pintura, Plomería, Gas y Planos | Servicios Pinamar',
    description: 'Pintores, plomeros, gasista matriculado, hidrolavado y planos en Ostende. Mantenimiento de casas, comercios y propiedades de la costa.',
    h1: 'Servicios de mantenimiento y planos en Ostende',
    eyebrow: 'Zona de cobertura · Ostende',
    lead: 'Pintura, hidrolavado, plomería, gas y planos para casas, comercios y propiedades en Ostende, con coordinación clara por WhatsApp.',
    neighborhoods: ['Casco de Ostende', 'Bosque de Ostende', 'Playas de Ostende', 'Accesos desde la Av. Shaw'],
    services: ['gas', 'pintura', 'hidrolavado', 'plomeria', 'planos'],
    body: [
      'Ostende tiene un perfil propio dentro de la costa: nació de los loteos de pioneros belgas a principios del siglo XX, y ese origen se nota en el trazado del casco y en las casas de estilo que todavía conviven con construcciones nuevas. Es una localidad más silenciosa que Pinamar, con muchas propiedades de uso familiar y estacional, un bosque que envuelve buena parte del casco y una playa ancha que la temporada ocupa sin agitar el resto del año.',
      'Las casas más antiguas de Ostende concentran trabajos de mantenimiento de instalaciones: cañerías de plomería con décadas de uso, artefactos de gas que se reemplazan en las refacciones y techos que después de años de salitre y humedad piden intervención. La revisión de gas y la modernización de puntos de consumo son habituales en estas propiedades cuando pasan de uso estacional a permanente.',
      'Las aberturas y las maderas son otro punto distintivo del mantenimiento en Ostende: ventanas de madera en casas de estilo, decks y cercos expuestos al viento de la playa. La pintura de esas superficies exige preparación previa con lijado y tratamiento de la madera, y es uno de los trabajos que más se valora cuando se hace bien, porque extiende la vida útil de cada pieza varios años.',
      'Los comercios del casco de Ostende suman una demanda particular: locales gastronómicos y de servicios que necesitan frentes presentables, baños comerciales sin pérdidas y instalaciones de gas en regla para habilitaciones e inspecciones. Estos trabajos se coordinan en horarios que no interrumpan la actividad del local y con el alcance cerrado antes de empezar.',
      'El hidrolavado en Ostende se concentra en frentes y veredas de los meses de invierno, cuando la humedad y el viento dejan verdín y manchas, y en la preparación de las casas antes de la temporada. En propiedades del bosque se suma la limpieza de canaletas, que en Ostende acumulan agujas de pino y hojas durante todo el año.',
      'Las refacciones y ampliaciones de casas antiguas de Ostende suelen necesitar documentación completa: planos de gas según NAG 200, planos sanitarios de desagües y planos de agua corriente con las bajadas de luz y agua corriente, elaborados con firma de gasista matriculado y orientados a la presentación ante Obras Particulares.',
      'La estacionalidad en Ostende es más marcada que en otras localidades: muchas propiedades se ocupan solo en enero y febrero, y el resto del año la localidad trabaja a otro ritmo. Eso se aprovecha para hacer los mantenimientos grandes fuera de temporada, con precios más razonables y sin presión de fechas, y para dejar cada propiedad lista antes de las primeras reservas.',
      'La coordinación a distancia también es la regla en Ostende: propietarios que vienen pocas semanas al año, administradores que manejan varias propiedades del casco y familias que heredaron la casa de la playa y no la usan seguido. En todos los casos el trabajo se documenta con fotos y se entrega con indicaciones de mantenimiento, para que la próxima intervención sea más simple. Esa continuidad en el cuidado es la que permite que las casas de Ostende conserven sus materiales y sus terminaciones originales décadas después.'
    ],
    faqs: [
      ['¿Trabajan en casas antiguas y de estilo en Ostende?', 'Sí. Hacemos mantenimiento de casas antiguas y de estilo: pintura de maderas y aberturas, revisión de instalaciones y refacciones que respetan las características de cada propiedad.'],
      ['¿Pueden revisar instalaciones de gas para habilitaciones de comercios?', 'Sí. Realizamos revisiones de gas y elaboramos la documentación necesaria para comercios y locales del casco de Ostende.'],
      ['¿Cómo coordinan trabajos si la propiedad está cerrada?', 'Por WhatsApp: coordinamos el acceso, enviamos fotos del avance y entregamos indicaciones de mantenimiento al finalizar.']
    ]
  }
] as const;

export type ZonePage = (typeof zones)[number];

export const getZoneUrl = (slug: string) => `${baseUrl}/zonas/${slug}/`;

export const getZoneBySlug = (slug: string) => zones.find((zone) => zone.slug === slug);