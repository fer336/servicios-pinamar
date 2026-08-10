import gas from './gas.json';
import hidrolavado from './hidrolavado.json';
import pintura from './pintura.json';
import plomeria from './plomeria.json';
import type { ServiceSlug, TrabajoItem } from './api';

interface TrabajosFile {
  service: ServiceSlug;
  items: TrabajoItem[];
}

export const trabajosFiles: Record<ServiceSlug, TrabajosFile> = {
  gas: gas as TrabajosFile,
  hidrolavado: hidrolavado as TrabajosFile,
  pintura: pintura as TrabajosFile,
  plomeria: plomeria as TrabajosFile
};
