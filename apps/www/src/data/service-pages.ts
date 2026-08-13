const baseUrl = 'https://www.serviciospinamar.com';

export const serviceAreas = ['Pinamar', 'Cariló', 'Valeria del Mar', 'Ostende'];

export const whatsapp = 'https://wa.me/5492267521448?text=Hola%2C%20quiero%20pedir%20un%20presupuesto.';

export const whatsappNumber = 'https://wa.me/5492267416252';

export const whatsappContact = whatsappNumber;

export const whatsappMessage = (servicio: string) =>
  `Hola Guido, quería hacerte una consulta por un trabajo de ${servicio}.`;

export const servicePages = [
  {
    slug: 'pintura',
    shortName: 'Pintura',
    serviceType: 'Pintura interior y exterior',
    title: 'Pintura en Pinamar y Pintores en Pinamar | Servicios Pinamar',
    description: 'Pintores en Pinamar para casas, locales y propiedades de la costa. Pintura interior, exterior, mantenimiento y presupuestos por WhatsApp.',
    h1: 'Pintores en Pinamar para casas, locales y propiedades de la costa',
    eyebrow: 'Pintura interior y exterior',
    lead: 'Pintores en Pinamar para trabajos de pintura interior, exterior, retoques, mantenimiento y terminaciones prolijas en propiedades expuestas al clima costero.',
    image: '/images/servicio-pintura.webp',
    imageAlt: 'Servicio de pintura interior y exterior en una propiedad de Pinamar',
    intent: 'pintura en Pinamar',
    covers: [
      'Pintura interior para ambientes de casas, departamentos y locales.',
      'Pintura exterior para frentes, muros, rejas, aberturas y superficies expuestas.',
      'Preparación de superficies, lijado, limpieza previa y terminaciones.',
      'Pintores para mantenimiento de propiedades de uso permanente o temporario.'
    ],
    situations: [
      'La humedad, el salitre o el sol deterioraron la pintura exterior.',
      'Necesitás dejar una casa o local listo antes de temporada.',
      'Querés renovar ambientes sin encarar una obra grande.',
      'Administrás una propiedad a distancia y necesitás seguimiento claro.'
    ],
    process: [
      'Nos contás qué superficie querés pintar y, si podés, enviás fotos o videos.',
      'Revisamos el alcance y coordinamos una visita cuando hace falta ver el estado real.',
      'Definimos preparación, materiales y tiempos antes de comenzar.',
      'Mantenemos comunicación durante el trabajo para que sepas cómo avanza.'
    ],
    gallery: {
      eyebrow: 'Trabajos realizados',
      title: 'Algunos de nuestros trabajos de pintura',
      description: 'Pintura interior, exterior y mantenimiento de superficies en propiedades de la costa.'
    },
    faqs: [
      ['¿Trabajan como pintores en Pinamar para casas y locales?', 'Sí. Realizamos pintura interior y exterior para casas, locales y propiedades en Pinamar, Cariló, Valeria del Mar y Ostende.'],
      ['¿Puedo pedir presupuesto enviando fotos?', 'Sí. Podés mandar fotos o videos por WhatsApp para una primera evaluación y coordinamos visita si hace falta.'],
      ['¿Trabajan en propiedades que no están habitadas todo el año?', 'Sí. Coordinamos el acceso y el seguimiento para propietarios, administradores o inmobiliarias.'],
      ['¿Qué zonas cubre el servicio de pintura?', 'Trabajamos en Pinamar, Cariló, Valeria del Mar y Ostende.']
    ]
  },
  {
    slug: 'hidrolavado',
    shortName: 'Hidrolavado',
    serviceType: 'Hidrolavado de exteriores',
    title: 'Hidrolavado en Pinamar | Servicios Pinamar',
    description: 'Hidrolavado en Pinamar para fachadas, techos, veredas, pisos, decks y muros. Limpieza exterior para propiedades de la Costa Atlántica.',
    h1: 'Hidrolavado en Pinamar para fachadas, pisos, techos y exteriores',
    eyebrow: 'Limpieza exterior de propiedades',
    lead: 'Hidrolavado en Pinamar para recuperar superficies castigadas por arena, humedad, hojas, tránsito y clima costero.',
    image: '/images/servicio-hidrolavado.webp',
    imageAlt: 'Hidrolavado de superficies exteriores en una propiedad de Pinamar',
    intent: 'hidrolavado en Pinamar',
    covers: [
      'Hidrolavados de fachadas, muros y frentes de propiedades.',
      'Limpieza de veredas, entradas, patios, pisos exteriores y decks.',
      'Hidrolavado de techos y superficies con suciedad acumulada.',
      'Preparación de exteriores antes de pintar o hacer mantenimiento.'
    ],
    situations: [
      'La arena y la humedad dejaron pisos o paredes opacos.',
      'Querés mejorar el frente de una propiedad antes de recibir visitas o alquilar.',
      'Necesitás limpiar superficies antes de pintar.',
      'Hay zonas exteriores con verdín, manchas o suciedad acumulada.'
    ],
    process: [
      'Relevamos las superficies a limpiar y el tipo de suciedad.',
      'Definimos el alcance para evitar trabajos innecesarios o zonas delicadas.',
      'Realizamos el hidrolavado cuidando materiales, bordes y accesos.',
      'Dejamos indicaciones si la limpieza forma parte de una preparación para pintura.'
    ],
    gallery: {
      eyebrow: 'Trabajos realizados',
      title: 'Algunos de nuestros trabajos de hidrolavado',
      description: 'Limpieza de fachadas, pisos, techos y exteriores en propiedades de Pinamar y la zona.'
    },
    faqs: [
      ['¿Qué superficies pueden hidrolavar?', 'Fachadas, techos, veredas, pisos, decks, muros y otras superficies exteriores aptas para este tipo de limpieza.'],
      ['¿El hidrolavado sirve para preparar superficies antes de pintar?', 'Sí. En muchos casos los hidrolavados ayudan a preparar superficies exteriores antes de pintar o hacer mantenimiento.'],
      ['¿Atienden casas de alquiler temporario?', 'Sí. Trabajamos con propietarios, inmobiliarias y administradores de propiedades en la zona.'],
      ['¿En qué zonas hacen hidrolavado?', 'En Pinamar, Cariló, Valeria del Mar y Ostende.']
    ]
  },
  {
    slug: 'gas',
    shortName: 'Gasista',
    serviceType: 'Servicio de gas',
    title: 'Gasista matriculado en Pinamar | Servicios Pinamar',
    description: 'Gasista matriculado en Pinamar (Matrícula 7040, ENARGAS 3316-SG) para instalaciones, revisiones, mantenimiento y planos de gas en casas, locales y propiedades de la costa. Coordiná presupuesto por WhatsApp.',
    h1: 'Gasista matriculado en Pinamar para instalaciones, revisiones y planos de gas',
    eyebrow: 'Instalaciones y revisión de gas',
    lead: 'Gasista en Pinamar para propiedades que necesitan instalación, revisión, reparación o mantenimiento de gas con comunicación clara desde el primer contacto.',
    image: '/images/servicio-gas.webp',
    imageAlt: 'Trabajo de gas y mantenimiento seguro para una propiedad de Pinamar',
    intent: 'gasista en Pinamar',
    credential: {
      name: 'Soliz Guido Angel',
      role: 'Gasista matriculado de primera',
      description: 'Responsable técnico habilitado para instalaciones, revisiones y reparaciones de gas en propiedades de Pinamar, Cariló, Valeria del Mar y Ostende.',
      items: [
        'Matrícula 7040',
        'ENARGAS 3316-SG',
        'Habilitación 21012 FG2802'
      ]
    },
    gallery: {
      eyebrow: 'Trabajos realizados',
      title: 'Algunos de nuestros trabajos de gas',
      description: 'Instalaciones, revisiones y reparaciones de gas en casas y locales de la costa, realizadas por matriculados.'
    },
    covers: [
      'Elaboración y presentación de planos de gas para ampliaciones y nuevas viviendas según NAG 200.',
      'Instalaciones de gas para casas, locales y propiedades.',
      'Revisión de conexiones, artefactos y puntos de consumo.',
      'Mantenimiento y reparaciones generales vinculadas al servicio de gas.',
      'Coordinación para propiedades habitadas, cerradas o administradas a distancia.'
    ],
    situations: [
      'Necesitás revisar una instalación antes de usar una propiedad.',
      'Hay que hacer mantenimiento de gas en una casa o local.',
      'Tenés que coordinar un trabajo de gas con acceso limitado o a distancia.',
      'Buscás resolver una reparación sin perder claridad sobre alcance y tiempos.'
    ],
    process: [
      'Nos describís la necesidad y compartís fotos o videos cuando ayuda a entender el caso.',
      'Evaluamos si hace falta una visita para revisar la instalación o el artefacto.',
      'Acordamos alcance, materiales necesarios y forma de trabajo.',
      'Realizamos el trabajo priorizando orden, comunicación y cuidado de la propiedad.'
    ],
    faqs: [
      ['¿Realizan instalaciones de gas en Pinamar?', 'Sí. Atendemos instalaciones, revisiones y mantenimiento de gas en Pinamar, Cariló, Valeria del Mar y Ostende.'],
      ['¿Elaboran planos de gas para ampliaciones o viviendas nuevas?', 'Sí. Como gasista matriculado elaboramos y presentamos planos de gas (NAG 200 e IRAM 4504) para ampliaciones y nuevas viviendas, listos para presentar ante Obras Particulares.'],
      ['¿Puedo coordinar si no estoy en la propiedad?', 'Sí. Coordinamos acceso con propietarios, administradores o inmobiliarias cuando corresponde.'],
      ['¿Puedo consultar por un gasista en Pinamar para revisar una instalación existente?', 'Sí. Podés consultar por revisión de conexiones, artefactos y puntos vinculados al servicio de gas.'],
      ['¿Qué zonas cubre el servicio de gas?', 'Pinamar, Cariló, Valeria del Mar y Ostende.']
    ]
  },
  {
    slug: 'plomeria',
    shortName: 'Plomería',
    serviceType: 'Plomería general',
    title: 'Plomeros en Pinamar y Plomería | Servicios Pinamar',
    description: 'Plomero en Pinamar para instalaciones, reparaciones, pérdidas de agua y mantenimiento general en casas, locales y propiedades de la costa.',
    h1: 'Plomeros en Pinamar para reparaciones, instalaciones y mantenimiento',
    eyebrow: 'Instalaciones y reparaciones de agua',
    lead: 'Plomero en Pinamar para resolver filtraciones, instalaciones, reparaciones y mantenimiento general en propiedades de Pinamar, Cariló, Valeria del Mar y Ostende.',
    image: '/images/servicio-plomeria.webp',
    imageAlt: 'Trabajo de plomería y mantenimiento para una casa en Pinamar',
    intent: 'plomería en Pinamar',
    credential: {
      name: 'Soliz Guido Angel',
      role: 'Gasista matriculado y plomero encargado',
      description: 'Responsable técnico de los trabajos de plomería en propiedades de Pinamar, Cariló, Valeria del Mar y Ostende.',
      items: []
    },
    gallery: {
      eyebrow: 'Trabajos realizados',
      title: 'Algunos de nuestros trabajos de plomería',
      description: 'Reparaciones, instalaciones y mantenimiento de plomería en propiedades de Pinamar, Cariló, Valeria del Mar y Ostende.'
    },
    covers: [
      'Presentación de planos sanitarios y bajadas de luz y agua corriente.',
      'Reparaciones de plomería en baños, cocinas, lavaderos y exteriores.',
      'Instalaciones y mantenimiento de cañerías, griferías y puntos de agua.',
      'Detección inicial de problemas visibles y coordinación del arreglo adecuado.',
      'Trabajos para casas, departamentos, locales y propiedades administradas.'
    ],
    situations: [
      'Apareció una pérdida, filtración o humedad visible.',
      'Necesitás instalar o cambiar griferías, conexiones o puntos de agua.',
      'Querés revisar la plomería antes de temporada o antes de alquilar.',
      'Administrás una propiedad y necesitás seguimiento con fotos o videos.'
    ],
    process: [
      'Nos contás el problema y enviás fotos o videos si el daño es visible.',
      'Identificamos si alcanza con presupuesto remoto o si conviene coordinar visita.',
      'Definimos reparación, materiales y tiempos antes de iniciar.',
      'Te mantenemos informado durante el trabajo, especialmente si no estás en la propiedad.'
    ],
    faqs: [
      ['¿Puedo consultar por un plomero en Pinamar si tengo una pérdida?', 'Sí. Atendemos consultas por pérdidas visibles, reparaciones, instalaciones y mantenimiento general de plomería.'],
      ['¿Puedo mandar fotos de una pérdida?', 'Sí. Las fotos o videos ayudan a entender el problema y definir si hace falta una visita.'],
      ['¿Trabajan con propiedades de alquiler o administradas?', 'Sí. Coordinamos con propietarios, administradores e inmobiliarias de la zona.'],
      ['¿Dónde brindan plomería?', 'En Pinamar, Cariló, Valeria del Mar y Ostende.']
    ]
  },
  {
    slug: 'planos',
    shortName: 'Planos',
    serviceType: 'Planos y trámites',
    title: 'Planos de Gas, Planos Sanitarios y de Agua Corriente en Pinamar | Servicios Pinamar',
    description: 'Planos de gas, planos sanitarios y planos de agua corriente en Pinamar. Elaboración y presentación ante Obras Particulares para ampliaciones y nuevas viviendas. Presupuesto por WhatsApp.',
    h1: 'Planos de Gas, Planos Sanitarios y de Agua Corriente en Pinamar',
    eyebrow: 'Planos y trámites',
    lead: 'Elaboramos planos de gas, planos sanitarios y planos de agua corriente para ampliaciones y nuevas viviendas en Pinamar, Cariló, Valeria del Mar y Ostende, con firma de gasista matriculado y orientación para la presentación ante Obras Particulares.',
    image: '/images/servicio-gas.webp',
    imageAlt: 'Trabajo de gas a cargo del gasista matriculado que elabora planos en Pinamar',
    intent: 'planos en Pinamar',
    credential: {
      name: 'Soliz Guido Angel',
      role: 'Gasista matriculado de primera',
      description: 'Responsable técnico habilitado para la elaboración de planos de gas y la firma de la documentación presentada ante Obras Particulares en Pinamar, Cariló, Valeria del Mar y Ostende.',
      items: [
        'Matrícula 7040',
        'ENARGAS 3316-SG',
        'Habilitación 21012 FG2802'
      ]
    },
    gallery: {
      eyebrow: 'Trabajos realizados',
      title: 'Algunos de nuestros trabajos de planos',
      description: 'Planos de gas, planos sanitarios y planos de agua corriente elaborados para propiedades de Pinamar, Cariló, Valeria del Mar y Ostende.'
    },
    covers: [
      'Planos de gas para ampliaciones y nuevas viviendas.',
      'Planos sanitarios para obras, reformas y regularizaciones.',
      'Planos de agua corriente, incluidas las bajadas de luz y agua corriente.',
      'Orientación para la presentación y el seguimiento ante Obras Particulares.',
      'Coordinación remota con propietarios, arquitectos, inmobiliarias y administradores.'
    ],
    situations: [
      'Necesitás planos para una ampliación, reforma o vivienda nueva.',
      'Obras Particulares te pidió regularizar la documentación de una instalación.',
      'Querés dejar la documentación lista antes de iniciar la obra.',
      'Coordinás una obra a distancia y necesitás un responsable técnico matriculado.'
    ],
    process: [
      'Te contamos qué documentación se necesita según el tipo de obra.',
      'Relevamos la instalación existente o el proyecto que querés construir.',
      'Elaboramos el plano correspondiente respetando las normas vigentes.',
      'Te orientamos en la presentación ante Obras Particulares y su seguimiento.'
    ],
    subtypes: [
      { slug: 'planos-de-gas', name: 'Planos de gas', description: 'Elaboración de planos de gas según NAG 200 e IRAM 4504 para ampliaciones y nuevas viviendas, listos para presentar ante Obras Particulares.' },
      { slug: 'planos-sanitarios', name: 'Planos sanitarios', description: 'Planos sanitarios de desagües cloacales y pluviales para obras, reformas y regularizaciones en propiedades de la costa.' },
      { slug: 'planos-agua-corriente', name: 'Planos de agua corriente', description: 'Planos de la instalación de agua corriente, incluidas las bajadas de luz y agua corriente, para viviendas y locales.' }
    ],
    sections: [
      {
        slug: 'planos-de-gas',
        title: 'Planos de gas',
        eyebrow: 'NAG 200 e IRAM 4504',
        body: [
          'El plano de gas documenta la instalación proyectada y la existente, con el trazado de cañerías, artefactos, ventilaciones y la ubicación del medidor. Se elabora según la NAG 200, la norma que regula las instalaciones de gas en edificios y viviendas, y se respetan las especificaciones de IRAM 4504 para conductos y ventilación de los artefactos.',
          'Los planos se dibujan en escala 1:100, la escala habitual para la presentación ante Obras Particulares, con el detalle necesario para que la instalación pueda verificarse durante la obra y en la habilitación final. Como gasista matriculado asumimos la firma y la responsabilidad técnica de la documentación.',
          'Si la propiedad ya tiene instalación de gas y la obra la modifica, el plano incluye el estado existente y el proyectado, que es lo que suele pedir el municipio al aprobar ampliaciones, refacciones o nuevas viviendas.'
        ],
        bullets: [
          'Instalaciones proyectadas de acuerdo con NAG 200.',
          'Conductos y ventilación según IRAM 4504.',
          'Plano en escala 1:100 con estado existente y proyectado.',
          'Firma y responsabilidad técnica de un gasista matriculado.'
        ],
        link: { label: 'Obras Particulares de Pinamar', href: 'https://tramites.pinamar.gob.ar' }
      },
      {
        slug: 'planos-sanitarios',
        title: 'Planos sanitarios',
        eyebrow: 'Desagües cloacales y pluviales',
        body: [
          'El plano sanitario documenta los desagües cloacales y pluviales de la propiedad: el recorrido de las cañerías, las pendientes, los artefactos sanitarios y el punto de conexión con la red. Es uno de los planos que más se piden al ampliar, reformar o construir, porque define cómo se comportan las instalaciones de la casa en el día a día.',
          'Incluye el detalle de cada ambiente con baño, cocina o lavadero, la ventilación de las cañerías y la vinculación con el colector o la cámara de inspección existente. Ese nivel de detalle evita problemas de pendientes, retrolavados y olores cuando la obra está terminada.',
          'También relevamos el estado existente cuando la propiedad ya tiene instalaciones y necesita regularizar su documentación ante el municipio.'
        ],
        bullets: [
          'Desagües cloacales y pluviales con pendientes indicadas.',
          'Artefactos sanitarios y ventilaciones por ambiente.',
          'Conexión con la red o cámara de inspección existente.',
          'Coordinación con plomería para dejar la obra lista.'
        ]
      },
      {
        slug: 'planos-agua-corriente',
        title: 'Planos de agua corriente',
        eyebrow: 'Bajadas de luz y agua corriente',
        body: [
          'El plano de agua corriente documenta la alimentación de la propiedad desde el medidor hasta los puntos de consumo: el recorrido de la bajada de agua corriente, la distribución de cañerías y la ubicación de los artefactos. En propiedades de la costa es común agruparlo con la bajada de luz, porque ambas instalaciones comparten los espacios de paso y la documentación ante Obras Particulares.',
          'El relevamiento distingue el estado existente del proyectado cuando hay reformas, e incluye los diámetros de cañerías según el número de puntos a abastecer, para que la presión y el caudal lleguen bien a pisos superiores y baños alejados.',
          'Este plano suele presentarse junto con el sanitario y el de gas cuando la obra toca varias instalaciones, por eso lo coordinamos como parte de un paquete de planos completo para el trámite municipal.'
        ],
        bullets: [
          'Alimentación desde el medidor y bajada de agua corriente.',
          'Distribución con diámetros según los puntos de consumo.',
          'Estado existente y proyectado para reformas.',
          'Documentación agrupada con la bajada de luz.'
        ]
      }
    ],
    faqs: [
      ['¿Qué incluye un plano de gas?', 'El plano de gas documenta la instalación existente y la proyectada según NAG 200, con conductos y ventilación según IRAM 4504, en escala 1:100, listo para presentar ante Obras Particulares.'],
      ['¿Qué son los planos sanitarios?', 'Son los planos de desagües cloacales y pluviales de la propiedad, con pendientes, artefactos y punto de conexión a la red. Se piden en ampliaciones, reformas y obras nuevas.'],
      ['¿Qué son las bajadas de luz y agua corriente?', 'La bajada de agua corriente alimenta la red interior desde el medidor; la bajada de luz hace lo propio con la instalación eléctrica. Los planos las documentan para la presentación ante Obras Particulares.'],
      ['¿Qué escala usan los planos?', 'Los planos se elaboran en escala 1:100, la escala habitual para la presentación ante Obras Particulares en Pinamar.'],
      ['¿Puedo coordinar el trámite si estoy a distancia?', 'Sí. Coordinamos la elaboración de los planos con fotos, planos previos o visitas puntuales, y te orientamos en la presentación y el seguimiento del trámite.']
    ]
  }
] as const;

export type ServicePage = (typeof servicePages)[number];

export const getServiceUrl = (slug: string) => `${baseUrl}/servicios/${slug}/`;

export const getRelatedServices = (slug: string) => servicePages.filter((service) => service.slug !== slug);

export const getServiceBySlug = (slug: string) => servicePages.find((service) => service.slug === slug);
