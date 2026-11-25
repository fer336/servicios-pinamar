export type JourneyStopId =
  | 'pintura' | 'hidrolavado' | 'plomeria' | 'gas' | 'electricidad' | 'fumigaciones' | 'jardineria'
  | 'herreria-rejas' | 'herreria-carteles' | 'herreria-techos' | 'durlock' | 'carpinteria';

// Camera framing exactly as shipped in the design package: [angle, targetX, targetY, targetZ, lift, span].
export type JourneyCamera = readonly [number, number, number, number, number, number];

export interface JourneyStop {
  id: JourneyStopId;
  service: string;
  place: string;
  description: string;
  href: string;
  camera: JourneyCamera;
}

// Order matters: it is the chooser order and the index the 3D scene uses for its worker crew.
// Electricidad (index 4) is the package's seventh crew member, moved next to Gas.
// Stops 8-12 are drawn by src/scene/trades-crew.js.
export const journeyStops: JourneyStop[] = [
  {
    id: 'pintura',
    service: 'Pintura',
    place: 'La fachada',
    description: 'El pintor pasa el rodillo por el muro exterior. Consultá por preparación de superficies y pintura para el clima de la costa.',
    href: '/servicios/pintura/',
    camera: [1.04, 4.15, 1.28, 0.92, 0.24, 8.0]
  },
  {
    id: 'hidrolavado',
    service: 'Hidrolavado',
    place: 'El deck',
    description: 'El operario barre las tablas con un chorro de agua a presión. También podés consultar por la limpieza de patios, pisos y fachadas.',
    href: '/servicios/hidrolavado/',
    camera: [0.69, 0.1, 1.27, 2.68, 0.4, 8.9]
  },
  {
    id: 'plomeria',
    service: 'Plomería',
    place: 'Las cañerías',
    description: 'El plomero ajusta una unión en la cañería exterior. Coordinamos la revisión de pérdidas, reparaciones e instalaciones de agua.',
    href: '/servicios/plomeria/',
    camera: [0.7, 4.25, 1.05, 0.1, 0.25, 6.9]
  },
  {
    id: 'gas',
    service: 'Gas',
    place: 'El medidor',
    description: 'El gasista revisa el equipo y sus conexiones con un instrumento de medición. Consultá por instalaciones y artefactos con un profesional matriculado.',
    href: '/servicios/gas/',
    camera: [0.81, 4.26, 1.25, -2.02, 0.27, 7.65]
  },
  {
    id: 'electricidad',
    service: 'Electricidad',
    place: 'El tablero',
    description: 'El electricista trabaja en el tablero y prueba la luz exterior. Consultá por electricidad domiciliaria y de obras nuevas.',
    href: '/servicios/electricidad/',
    camera: [0.35, 2.95, 1.35, 1.9, 0.24, 6.6]
  },
  {
    id: 'fumigaciones',
    service: 'Fumigaciones',
    place: 'Murciélagos en el techo',
    description: 'Exclusión de murciélagos en el alero: el profesional instala una malla de salida desde una escalera. Consultá también por otros servicios de control de plagas.',
    href: '/servicios/fumigaciones/',
    camera: [-1.08, -4.8, 2.55, -0.15, 0.2, 7.8]
  },
  {
    id: 'jardineria',
    service: 'Jardinería y poda',
    place: 'Los pinos',
    description: 'El jardinero poda una rama baja del pino con una herramienta de pértiga. También coordinamos poda de arbustos, corte de pasto y mantenimiento del jardín.',
    href: '/servicios/jardineria/',
    camera: [-0.28, -5.88, 1.7, 2.98, 0.31, 9.4]
  },
  {
    id: 'herreria-rejas',
    service: 'Herrería · Rejas',
    place: 'El frente',
    description: 'El herrero suelda uno a uno los barrotes de la reja del frente. Consultá por rejas, frentes completos y portones corredizos o elevadizos.',
    href: '/servicios/herreria/',
    camera: [0.35, -1.0, 0.95, 6.3, 0.22, 6.2]
  },
  {
    id: 'herreria-carteles',
    service: 'Herrería · Carteles',
    place: 'El taller',
    description: 'El herrero suelda el marco del cartel en la mesa de trabajo y le coloca la chapa. También hacemos parrillas y trabajos de herrería a medida.',
    href: '/servicios/herreria/',
    camera: [0.45, 1.7, 0.85, 6.8, 0.42, 5.6]
  },
  {
    id: 'herreria-techos',
    service: 'Herrería · Techos',
    place: 'La estructura del quincho',
    description: 'Desde el andamio, el herrero suelda las correas de perfil C sobre la estructura de caño y después se colocan las chapas. Consultá por estructuras de techo.',
    href: '/servicios/herreria/',
    camera: [-0.55, 5.8, 1.9, 6.2, 0.38, 7.4]
  },
  {
    id: 'durlock',
    service: 'Durlock',
    place: 'La pared trasera',
    description: 'El colocador fija la placa de durlock a los montantes y pasa la llana con masilla sobre la junta. Consultá por tabiques, cielorrasos y revestimientos.',
    href: '/servicios/durlock/',
    camera: [3.69, -1.4, 1.35, -3.2, 0.22, 6.6]
  },
  {
    id: 'carpinteria',
    service: 'Carpintería',
    place: 'El deck del jardín',
    description: 'El carpintero coloca y clava las tablas del deck de madera sobre los tirantes. Consultá por decks, pérgolas y trabajos de madera a medida.',
    href: '/servicios/carpinteria/',
    camera: [0.55, -4.3, 0.45, 5.6, 0.45, 6.4]
  }
];
