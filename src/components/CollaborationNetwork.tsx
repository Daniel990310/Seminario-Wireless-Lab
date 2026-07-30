import { useRef, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { cn } from '@/lib/utils';

/**
 * Topología de colaboración del seminario.
 *
 * Los nodos de la izquierda son las instituciones extranjeras y los de la
 * derecha las chilenas; todos convergen en la PUCV, que organiza. Los haces
 * animados de Magic UI representan los enlaces: es la misma idea que el tema
 * del seminario, un enlace inalámbrico que además transporta información.
 *
 * Se hidrata con `client:visible` porque AnimatedBeam mide la posición real de
 * cada nodo en el DOM para trazar la curva, algo que no se puede precalcular.
 */

interface NodeSpec {
  id: string;
  label: string;
  detail: string;
  country: string;
}

const FOREIGN: NodeSpec[] = [
  { id: 'columbia', label: 'Columbia University', detail: 'Gil Zussman', country: 'EE. UU.' },
  {
    id: 'bell-labs',
    label: 'Nokia Bell Labs',
    detail: 'Jinfeng Du · Reinaldo A. Valenzuela',
    country: 'EE. UU.',
  },
];

const LOCAL: NodeSpec[] = [
  { id: 'uc', label: 'PUC de Chile', detail: 'Miguel Gutiérrez Gaitán', country: 'Chile' },
  { id: 'usach', label: 'U. de Santiago', detail: 'Karel Toledo de la Garza', country: 'Chile' },
];

const Node = ({
  ref,
  spec,
  align,
}: {
  ref: RefObject<HTMLDivElement | null>;
  spec: NodeSpec;
  align: 'start' | 'end';
}) => (
  <div
    ref={ref}
    className={cn(
      'z-10 flex w-full max-w-[15rem] flex-col rounded-surface border border-border bg-surface/90 px-4 py-3',
      align === 'end' && 'items-end text-right',
    )}
  >
    <p className="font-display text-sm leading-tight font-semibold text-foreground">{spec.label}</p>
    <p className="mt-1 text-xs leading-snug text-muted-foreground">{spec.detail}</p>
    <p className="eyebrow mt-1.5 text-[0.6rem] text-muted-foreground">{spec.country}</p>
  </div>
);

export default function CollaborationNetwork() {
  const container = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const columbia = useRef<HTMLDivElement>(null);
  const bellLabs = useRef<HTMLDivElement>(null);
  const uc = useRef<HTMLDivElement>(null);
  const usach = useRef<HTMLDivElement>(null);

  // Con movimiento reducido el haz recorre el trazo una sola vez y se detiene.
  // La línea base (pathColor) siempre se dibuja, así que la topología de la red
  // sigue siendo legible sin animación.
  const reduced = useReducedMotion();

  /*
   * Un solo tono y recorrido lento: el haz representa una transmisión, no un
   * efecto de interfaz.
   *
   * Los colores se pasan como referencias a variables CSS en lugar de hex fijos,
   * de modo que el haz siga al tema sin duplicar el componente (RF-4.9).
   */
  const beam = {
    pathColor: 'var(--border)',
    pathWidth: 1.25,
    pathOpacity: 0.9,
    gradientStartColor: 'var(--primary)',
    gradientStopColor: 'var(--primary)',
    duration: 7,
    repeatDelay: 1.5,
    repeat: reduced ? 0 : Infinity,
  };

  return (
    <div
      ref={container}
      className="relative flex w-full items-stretch justify-between gap-4 overflow-hidden px-1 py-6 sm:gap-8 sm:px-2"
    >
      <div className="flex flex-col justify-center gap-8 sm:gap-14">
        <Node ref={columbia} spec={FOREIGN[0]!} align="start" />
        <Node ref={bellLabs} spec={FOREIGN[1]!} align="start" />
      </div>

      {/* Nodo central: la institución organizadora */}
      <div className="flex flex-col justify-center">
        <div
          ref={hub}
          className="z-10 flex flex-col items-center rounded-surface border border-primary/40 bg-surface px-4 py-5 text-center sm:px-6"
        >
          <span
            className="grid size-9 place-items-center rounded-full border border-primary/40"
            aria-hidden="true"
          >
            <span className="block size-1.5 rounded-full bg-primary" />
          </span>
          <p className="mt-3 font-display text-sm leading-tight font-semibold text-foreground sm:text-base">
            PUCV
          </p>
          <p className="mt-1 text-xs leading-snug text-muted-foreground">
            Escuela de Ingeniería Eléctrica
          </p>
          <p className="eyebrow mt-2 text-[0.6rem] text-primary">Organiza</p>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-8 sm:gap-14">
        <Node ref={uc} spec={LOCAL[0]!} align="end" />
        <Node ref={usach} spec={LOCAL[1]!} align="end" />
      </div>

      <AnimatedBeam containerRef={container} fromRef={columbia} toRef={hub} curvature={55} {...beam} />
      <AnimatedBeam
        containerRef={container}
        fromRef={bellLabs}
        toRef={hub}
        curvature={-55}
        delay={0.8}
        {...beam}
      />
      <AnimatedBeam
        containerRef={container}
        fromRef={uc}
        toRef={hub}
        curvature={55}
        delay={1.6}
        reverse
        {...beam}
      />
      <AnimatedBeam
        containerRef={container}
        fromRef={usach}
        toRef={hub}
        curvature={-55}
        delay={2.4}
        reverse
        {...beam}
      />
    </div>
  );
}
