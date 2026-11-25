import carpinteria from './carpinteria.json';
import durlock from './durlock.json';
import electricidad from './electricidad.json';
import gas from './gas.json';
import herreria from './herreria.json';
import fumigaciones from './fumigaciones.json';
import hidrolavado from './hidrolavado.json';
import jardineria from './jardineria.json';
import pintura from './pintura.json';
import plomeria from './plomeria.json';
import type { ServiceSlug, TrabajoItem } from './api';

interface TrabajosFile {
  service: ServiceSlug;
  items: TrabajoItem[];
}

export const trabajosFiles: Record<ServiceSlug, TrabajosFile> = {
  carpinteria: carpinteria as TrabajosFile,
  durlock: durlock as TrabajosFile,
  electricidad: electricidad as TrabajosFile,
  fumigaciones: fumigaciones as TrabajosFile,
  gas: gas as TrabajosFile,
  herreria: herreria as TrabajosFile,
  hidrolavado: hidrolavado as TrabajosFile,
  jardineria: jardineria as TrabajosFile,
  pintura: pintura as TrabajosFile,
  plomeria: plomeria as TrabajosFile
};
