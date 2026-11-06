export type JourneyStopId = 'pintura' | 'hidrolavado' | 'plomeria' | 'gas' | 'fumigaciones' | 'jardineria';

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
// The package also ships an "Electricidad" stop; the site has no such service page, so it is left out.
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
  }
];
