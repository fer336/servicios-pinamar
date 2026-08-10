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
    h1: 'Pintura en Pinamar para casas, locales y propiedades de la costa',
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
      'Hidrolavado de fachadas, muros y frentes de propiedades.',
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
      ['¿El hidrolavado sirve para preparar superficies antes de pintar?', 'Sí. En muchos casos el hidrolavado ayuda a preparar superficies exteriores antes de pintar o hacer mantenimiento.'],
      ['¿Atienden casas de alquiler temporario?', 'Sí. Trabajamos con propietarios, inmobiliarias y administradores de propiedades en la zona.'],
      ['¿En qué zonas hacen hidrolavado?', 'En Pinamar, Cariló, Valeria del Mar y Ostende.']
    ]
  },
  {
    slug: 'gas',
    shortName: 'Gasista',
    serviceType: 'Servicio de gas',
    title: 'Gasista en Pinamar | Servicios Pinamar',
    description: 'Gasista en Pinamar para instalaciones, revisiones y mantenimiento de gas en casas, locales y propiedades. Coordiná presupuesto por WhatsApp.',
    h1: 'Gasista en Pinamar para instalaciones, revisiones y mantenimiento',
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
      'Elaboración y presentación de planos de gas para ampliaciones y nuevas viviendas.',
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
      ['¿Puedo coordinar si no estoy en la propiedad?', 'Sí. Coordinamos acceso con propietarios, administradores o inmobiliarias cuando corresponde.'],
      ['¿Puedo consultar por un gasista en Pinamar para revisar una instalación existente?', 'Sí. Podés consultar por revisión de conexiones, artefactos y puntos vinculados al servicio de gas.'],
      ['¿Qué zonas cubre el servicio de gas?', 'Pinamar, Cariló, Valeria del Mar y Ostende.']
    ]
  },
  {
    slug: 'plomeria',
    shortName: 'Plomería',
    serviceType: 'Plomería general',
    title: 'Plomero Pinamar y Plomería en Pinamar | Servicios Pinamar',
    description: 'Plomero en Pinamar para instalaciones, reparaciones, pérdidas de agua y mantenimiento general en casas, locales y propiedades de la costa.',
    h1: 'Plomería en Pinamar para reparaciones, instalaciones y mantenimiento',
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
  }
] as const;

export type ServicePage = (typeof servicePages)[number];

export const getServiceUrl = (slug: string) => `${baseUrl}/servicios/${slug}/`;

export const getRelatedServices = (slug: string) => servicePages.filter((service) => service.slug !== slug);

export const getServiceBySlug = (slug: string) => servicePages.find((service) => service.slug === slug);
