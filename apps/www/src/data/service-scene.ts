export type SceneModeId = 'pintura' | 'hidrolavado' | 'plomeria' | 'gas' | 'fumigaciones' | 'jardineria';

export interface SceneMode {
  id: SceneModeId;
  label: string;
  title: string;
  description: string;
  href: string;
  fallbackImage: string;
}

// Order matters: it is the tab order in the home scene and the index used by the 3D scene.
export const sceneModes: SceneMode[] = [
  {
    id: 'pintura',
    label: 'Pintura',
    title: 'Pintura interior y exterior',
    description: 'Nuestro pintor trabaja la pared mientras la fachada cambia de color. Materiales adecuados para el clima costero: sal, humedad y viento.',
    href: '/servicios/pintura/',
    fallbackImage: '/images/servicio-pintura.webp'
  },
  {
    id: 'hidrolavado',
    label: 'Hidrolavado',
    title: 'Hidrolavado de superficies',
    description: 'Un operario limpia el techo y otro las paredes y el deck: mirá cómo recuperan su color.',
    href: '/servicios/hidrolavado/',
    fallbackImage: '/images/servicio-hidrolavado.webp'
  },
  {
    id: 'plomeria',
    label: 'Plomería',
    title: 'Plomería, vista por dentro',
    description: 'El plomero repara la pérdida bajo la bacha. Instalaciones, reparaciones y mantenimiento general.',
    href: '/servicios/plomeria/',
    fallbackImage: '/images/servicio-plomeria.webp'
  },
  {
    id: 'gas',
    label: 'Gas',
    title: 'Instalaciones de gas',
    description: 'Un gasista controla el medidor y otro revisa el calefón. Revisión, reparación e instalación de artefactos.',
    href: '/servicios/gas/',
    fallbackImage: '/images/servicio-gas.webp'
  },
  {
    id: 'fumigaciones',
    label: 'Fumigaciones',
    title: 'Fumigaciones con certificado',
    description: 'Un profesional trata el perímetro y otro revisa el techo donde anidan murciélagos. Al terminar entrega el certificado del trabajo.',
    href: '/servicios/fumigaciones/',
    fallbackImage: '/images/servicio-fumigaciones-3d.webp'
  },
  {
    id: 'jardineria',
    label: 'Jardinería',
    title: 'Jardinería, poda y parquización',
    description: 'Un jardinero corta el pasto con la cortadora y otro poda el cerco: así queda el jardín de tu propiedad.',
    href: '/servicios/jardineria/',
    fallbackImage: '/images/servicio-jardineria-3d.webp'
  }
];
