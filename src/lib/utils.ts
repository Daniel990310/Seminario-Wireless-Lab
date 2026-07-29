import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind resolviendo conflictos.
 *
 * Los componentes de Magic UI importan este helper desde `@/lib/utils`, que es
 * la convención de shadcn/ui. Se mantiene la misma ruta para poder copiar
 * componentes nuevos del registro sin editarlos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
