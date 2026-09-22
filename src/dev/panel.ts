/**
 * Lógica del panel de ajuste visual. **Solo se carga en `npm run dev`**: la ruta
 * `/ajustar` la inyecta una integración de `astro.config.mjs` que no corre en
 * `build`, así que este archivo no puede terminar en `dist/`.
 *
 * Qué hace y qué NO hace, porque la distinción es el propósito de la herramienta:
 *
 *   - **No** edita el repositorio. Nada de lo que se toque aquí modifica un solo
 *     archivo del proyecto. Es un borrador que vive en `localStorage`.
 *   - **Sí** emite valores. Cada perilla está atada a una propiedad real de un
 *     componente real, y el informe dice en qué archivo va cada número. Eso es lo
 *     que se pega en el chat para que se implemente.
 *
 * La página se muestra dentro de un `<iframe>` y no incrustada en este documento,
 * por una razón que se puede comprobar: las `media query` se resuelven contra el
 * ancho del *viewport*, y el de un iframe es su propio ancho. Así el control de
 * ancho reproduce de verdad el móvil, en vez de encoger un contenedor y dejar
 * aplicado el diseño de escritorio.
 */

type Idioma = 'es' | 'en';
type Tema = 'light' | 'dark';
type ModoFondo = 'solido' | 'imagen';

interface ImagenCargada {
  nombre: string;
  /** `data:` URL ya reducida; ver `reducir`. */
  datos: string;
  /** Medidas del archivo original, para saber con qué se cuenta al instalarlo. */
  ancho?: number;
  altoPx?: number;
}

interface AjusteFranja {
  x: number;
  y: number;
  escala: number;
  velo: number;
  alto: number;
  /**
   * Con `relacionFija`, la altura pasa a ser `100vw / relacion` y el recorte que
   * se ve es **el mismo en toda pantalla**. Sin ella rige el `clamp` de hoy, que
   * mantiene la relación solo entre 686 y 1219 px de ancho `[medido: 2026-09-22]`.
   */
  relacionFija: boolean;
  relacion: number;
  /** Fracción superior de la banda que cubre el degradado hacia la barra. */
  desvanecido: number;
  imagen: ImagenCargada | null;
}

interface AjusteSeccion {
  modo: ModoFondo;
  x: number;
  y: number;
  velo: number;
  desenfoque: number;
  imagen: ImagenCargada | null;
}

interface AjusteRetrato {
  x: number;
  y: number;
}

interface CambioTexto {
  seccion: string;
  etiqueta: string;
  original: string;
  nuevo: string;
}

interface Ajustes {
  vista: { ancho: number; tema: Tema; idioma: Idioma };
  franja: AjusteFranja;
  secciones: Record<string, AjusteSeccion>;
  retratos: Record<string, AjusteRetrato>;
  textos: Record<string, CambioTexto>;
}

const CLAVE_ACTUAL = 'panel-ajuste:actual';
const CLAVE_INSTANTANEAS = 'panel-ajuste:instantaneas';

/** Los valores de partida son los que hoy están en el repositorio, no ceros. */
const FRANJA_ACTUAL: AjusteFranja = {
  x: 50,
  y: 50,
  escala: 1,
  velo: 18,
  alto: 1,
  relacionFija: false,
  relacion: 7.33, // la que ya rige entre 686 y 1219 px `[medido: 2026-09-22]`
  desvanecido: 18,
  imagen: null,
};

function seccionPorOmision(): AjusteSeccion {
  return { modo: 'solido', x: 50, y: 50, velo: 100, desenfoque: 0, imagen: null };
}

function porOmision(): Ajustes {
  return {
    vista: { ancho: 0, tema: 'light', idioma: 'es' },
    franja: { ...FRANJA_ACTUAL },
    secciones: {},
    retratos: {},
    textos: {},
  };
}

function cargar(): Ajustes {
  try {
    const crudo = localStorage.getItem(CLAVE_ACTUAL);
    const base = porOmision();
    if (!crudo) return base;
    // Mezcla por nivel y no superficial: un borrador guardado antes de que
    // existiera una perilla nueva se queda sin ella y `undefined` se cuela en el CSS.
    const guardado = JSON.parse(crudo) as Partial<Ajustes>;
    return {
      ...base,
      ...guardado,
      vista: { ...base.vista, ...(guardado.vista ?? {}) },
      franja: { ...base.franja, ...(guardado.franja ?? {}) },
    };
  } catch {
    return porOmision();
  }
}

let ajustes = cargar();

function guardar(): void {
  try {
    localStorage.setItem(CLAVE_ACTUAL, JSON.stringify(ajustes));
  } catch {
    // Cuota agotada: casi siempre una fotografía grande metida en el borrador.
    avisar(
      'No se pudo guardar el borrador: las imágenes cargadas ocupan demasiado. ' +
        'Siguen aplicadas en esta sesión, pero se pierden al recargar.',
    );
  }
}

/* -------------------------------------------------------------------- marco */

const marco = document.getElementById('lienzo') as HTMLIFrameElement;
const avisoEl = document.getElementById('aviso') as HTMLElement;
const informeEl = document.getElementById('informe') as HTMLTextAreaElement;
const diagnosticoEl = document.getElementById('diagnostico') as HTMLElement;
const controlesEl = document.getElementById('controles') as HTMLElement;

function avisar(texto: string): void {
  avisoEl.textContent = texto;
  avisoEl.hidden = texto === '';
}

function pagina(): Document | null {
  return marco.contentDocument;
}

/** Nota viva bajo el control de relación; se rellena en `aplicar`. */
let notaRelacion: HTMLElement | null = null;

const ANCHOS_DE_REFERENCIA = [390, 768, 1280, 1920];

/** Lo que mide la franja ahora mismo en el marco, no lo que debería medir. */
function medidaDeLaFranja(): { ancho: number; alto: number } | null {
  const el = pagina()?.querySelector('.franja-sede');
  if (!el) return null;
  const c = el.getBoundingClientRect();
  return c.height > 0 ? { ancho: c.width, alto: c.height } : null;
}

function pintarNotaRelacion(): void {
  if (!notaRelacion) return;
  const f = ajustes.franja;
  const medida = medidaDeLaFranja();
  const ahora = medida
    ? `Ahora mismo: ${Math.round(medida.ancho)} × ${Math.round(medida.alto)} px → ${(medida.ancho / medida.alto).toFixed(2)} : 1.`
    : '';

  if (!f.relacionFija) {
    notaRelacion.textContent =
      `${ahora} Sin fijarla, el recorte solo se mantiene entre 686 y 1219 px de ancho; ` +
      'fuera de ahí la altura se topa y se ve más o menos fotografía. [medido: 2026-09-22]';
    return;
  }

  const alturas = ANCHOS_DE_REFERENCIA.map((w) => `${w}px → ${Math.round(w / f.relacion)}px de alto`).join(' · ');
  notaRelacion.textContent = `${ahora} Fijada en ${f.relacion.toFixed(2)} : 1 → ${alturas}. Mirá el móvil antes de decidir.`;
}

/* --------------------------------------------------------- aplicar ajustes */

/**
 * La hoja que se inyecta en la página. Se regenera entera en cada cambio: es un
 * kilobyte de texto y evita llevar la cuenta de qué regla hay que retirar.
 */
function construirCss(): string {
  const f = ajustes.franja;
  // Con relación fija la altura se deriva del ancho de la ventana, así que el
  // recorte visible deja de depender de la pantalla. Se sigue expresando como
  // **altura** y no como `aspect-ratio` a propósito: la contracción al hacer
  // scroll anima `height`, y animar desde `auto` no es lo mismo en todo navegador.
  const alturaFranja = f.relacionFija
    ? `calc(100vw / ${f.relacion})`
    : `calc(clamp(9rem, 21vw, 16rem) * 0.65 * ${f.alto})`;
  const lineas: string[] = [
    `:root { --alto-franja: ${alturaFranja}; }`,
    `.franja-sede { --velo: ${f.velo}%; --desvanecido: ${f.desvanecido}%; }`,
    // `!important` porque `FranjaSede.astro` pone `object-position` en el atributo
    // `style` del propio `<img>`, y un estilo en línea gana a cualquier hoja.
    `.franja-sede__imagen { object-position: ${f.x}% ${f.y}% !important;` +
      ` transform: scale(${f.escala}); transform-origin: ${f.x}% ${f.y}%; }`,
  ];

  for (const [id, s] of Object.entries(ajustes.secciones)) {
    if (s.modo !== 'imagen' || !s.imagen) continue;
    lineas.push(
      `#${id} { isolation: isolate; }`,
      `#${id}::before { content:""; position:absolute; inset:0; z-index:0; pointer-events:none;` +
        ` background-image:url("${s.imagen.datos}"); background-size:cover;` +
        ` background-position:${s.x}% ${s.y}%; filter:blur(${s.desenfoque}px); }`,
      `#${id}::after { content:""; position:absolute; inset:0; z-index:0; pointer-events:none;` +
        ` background-color:var(--background); opacity:${(s.velo / 100).toFixed(2)}; }`,
      `#${id} > * { position:relative; z-index:1; }`,
    );
  }

  return lineas.join('\n');
}

function aplicar(): void {
  const d = pagina();
  if (!d) return;

  // Ancho del marco: 0 es «todo el espacio disponible».
  marco.style.width = ajustes.vista.ancho === 0 ? '100%' : `${ajustes.vista.ancho}px`;

  // El tema lo fija el propio sitio al arrancar leyendo `tema-seminario`
  // (`BaseLayout.astro`); se escribe la misma clave para que un recargado no
  // deshaga la elección hecha aquí.
  try {
    localStorage.setItem('tema-seminario', ajustes.vista.tema);
  } catch {
    /* modo privado: el atributo de abajo basta para esta sesión */
  }
  d.documentElement.dataset.theme = ajustes.vista.tema;

  let hoja = d.getElementById('ajustes-del-panel') as HTMLStyleElement | null;
  if (!hoja) {
    hoja = d.createElement('style');
    hoja.id = 'ajustes-del-panel';
    d.head.append(hoja);
  }
  hoja.textContent = construirCss();

  // La imagen de la franja se cambia por DOM y no por CSS: `<img>` es un elemento
  // reemplazado, y sustituir su fuente conserva `object-fit` y las medidas ya
  // calculadas. `srcset` hay que vaciarlo, o gana al `src`.
  const imgFranja = d.querySelector<HTMLImageElement>('.franja-sede__imagen');
  if (imgFranja) {
    if (imgFranja.dataset.fuenteOriginal === undefined) {
      imgFranja.dataset.fuenteOriginal = imgFranja.getAttribute('src') ?? '';
      imgFranja.dataset.conjuntoOriginal = imgFranja.getAttribute('srcset') ?? '';
    }
    if (ajustes.franja.imagen) {
      imgFranja.removeAttribute('srcset');
      imgFranja.src = ajustes.franja.imagen.datos;
    } else {
      imgFranja.src = imgFranja.dataset.fuenteOriginal;
      if (imgFranja.dataset.conjuntoOriginal) imgFranja.srcset = imgFranja.dataset.conjuntoOriginal;
    }
  }

  for (const [clave, r] of Object.entries(ajustes.retratos)) {
    const img = d.querySelector<HTMLImageElement>(`[data-retrato="${CSS.escape(clave)}"]`);
    if (img) img.style.objectPosition = `${r.x}% ${r.y}%`;
  }

  aplicarTextos(d);
  pintarDiagnostico();
  // Tras un cambio de altura hay que dejar maquetar antes de medir la franja.
  requestAnimationFrame(pintarNotaRelacion);
  informeEl.value = informe();
}

/* ------------------------------------------------------------------ textos */

const SELECTOR_TEXTO = 'main h1, main h2, main h3, main p, main li, main .eyebrow';

/** Nodos de texto «hoja»: sin hijos elemento, para no romper marcado al editar. */
function nodosDeTexto(d: Document): HTMLElement[] {
  return [...d.querySelectorAll<HTMLElement>(SELECTOR_TEXTO)].filter((n) => n.children.length === 0);
}

function claveDe(n: HTMLElement, indice: number): string {
  const seccion = n.closest('section[id]')?.id ?? 'sin-seccion';
  return `${seccion}|${n.tagName.toLowerCase()}|${indice}`;
}

function aplicarTextos(d: Document): void {
  nodosDeTexto(d).forEach((n, i) => {
    const cambio = ajustes.textos[claveDe(n, i)];
    if (cambio && n.textContent !== cambio.nuevo) n.textContent = cambio.nuevo;
  });
}

let editandoTextos = false;

function alternarEdicionDeTextos(activo: boolean): void {
  editandoTextos = activo;
  const d = pagina();
  if (!d) return;

  nodosDeTexto(d).forEach((n, i) => {
    n.contentEditable = activo ? 'true' : 'false';
    n.style.outline = activo ? '1px dashed rgba(220,120,40,.75)' : '';
    n.style.outlineOffset = activo ? '3px' : '';
    if (!activo) return;

    if (n.dataset.panelAtado === 'si') return;
    n.dataset.panelAtado = 'si';
    const clave = claveDe(n, i);
    const original = ajustes.textos[clave]?.original ?? n.textContent ?? '';
    n.addEventListener('input', () => {
      const nuevo = n.textContent ?? '';
      if (nuevo === original) {
        delete ajustes.textos[clave];
      } else {
        ajustes.textos[clave] = {
          seccion: n.closest('section[id]')?.id ?? 'sin-seccion',
          etiqueta: n.tagName.toLowerCase(),
          original,
          nuevo,
        };
      }
      guardar();
      informeEl.value = informe();
    });
  });
}

/* ------------------------------------------------------------- diagnóstico */

/**
 * La regla no es un número de contraste, y esto ya costó una medición en el
 * proyecto: axe marca como **indeterminado** todo texto que tenga una imagen en
 * su pila de fondo, sea cual sea el velo que se le ponga encima, y `verify.mjs`
 * exige 0 nodos indeterminados (RNF-1.3). Así que «imagen bajo texto» es
 * binario: o el velo es opaco y la imagen no se ve, o la comprobación falla.
 * La nota larga está en `src/components/FranjaSede.astro`, líneas 5-17.
 */
function diagnostico(): string[] {
  const problemas: string[] = [];
  for (const [id, s] of Object.entries(ajustes.secciones)) {
    if (s.modo !== 'imagen' || !s.imagen) continue;
    if (s.velo >= 100) {
      problemas.push(`#${id}: el velo está al 100 %, la imagen no se ve. Publicable, pero no aporta nada.`);
    } else {
      problemas.push(
        `#${id}: imagen bajo texto con velo ${s.velo} %. axe devolverá esos textos como contraste ` +
          'indeterminado y «npm run verify» fallará (RNF-1.3). Lo que sí se publica es una banda de ' +
          'imagen sin texto encima, como la franja de la sede.',
      );
    }
  }
  return problemas;
}

function pintarDiagnostico(): void {
  const problemas = diagnostico();
  diagnosticoEl.hidden = problemas.length === 0;
  diagnosticoEl.textContent = '';
  for (const p of problemas) {
    const li = document.createElement('li');
    li.textContent = p;
    diagnosticoEl.append(li);
  }
}

/* ----------------------------------------------------------------- informe */

function informe(): string {
  const f = ajustes.franja;
  const l: string[] = [];
  l.push(`# Ajustes del panel · ${new Date().toLocaleString('es-CL')}`);
  l.push('');
  l.push(
    `Vista usada: ancho ${ajustes.vista.ancho === 0 ? 'completo' : `${ajustes.vista.ancho} px`} · ` +
      `tema ${ajustes.vista.tema} · idioma ${ajustes.vista.idioma}`,
  );
  l.push('');

  const medida = medidaDeLaFranja();
  if (medida) {
    l.push(
      `Franja tal como se está viendo: ${Math.round(medida.ancho)} × ${Math.round(medida.alto)} px ` +
        `→ ${(medida.ancho / medida.alto).toFixed(2)} : 1`,
    );
    l.push('');
  }

  const franjaCambiada =
    f.x !== 50 ||
    f.y !== 50 ||
    f.escala !== 1 ||
    f.velo !== 18 ||
    f.desvanecido !== 18 ||
    f.alto !== 1 ||
    f.relacionFija ||
    f.imagen !== null;
  if (franjaCambiada) {
    l.push('## Franja de la sede');
    if (f.x !== 50 || f.y !== 50) {
      l.push(`- encuadre: "${f.x}% ${f.y}%"  (antes "50% 50%")  → src/components/SiteHeader.astro, prop \`encuadre\``);
    }
    if (f.velo !== 18) l.push(`- velo: ${f.velo}%  (antes 18%)  → src/components/FranjaSede.astro, \`--velo\``);
    if (f.desvanecido !== 18) {
      l.push(`- desvanecido: ${f.desvanecido}%  (antes 18%)  → src/components/FranjaSede.astro, \`--desvanecido\``);
    }
    if (f.relacionFija) {
      l.push(`- relación FIJA: ${f.relacion.toFixed(2)} : 1  → src/styles/global.css, \`--alto-franja: calc(100vw / ${f.relacion.toFixed(2)})\``);
      l.push(
        `    alturas que resultan: ${ANCHOS_DE_REFERENCIA.map((w) => `${w}px → ${Math.round(w / f.relacion)}px`).join(' · ')}`,
      );
      l.push('    (con la relación fija, el control de «alto» deja de tener efecto)');
    } else if (f.alto !== 1) {
      l.push(`- alto: ×${f.alto}  → src/styles/global.css, \`--alto-franja\``);
    }
    if (f.escala !== 1) {
      l.push(`- zoom: ${f.escala}×  ⚠ no existe hoy: hace falta una prop nueva en FranjaSede.astro`);
    }
    if (f.imagen) {
      const medidas = f.imagen.ancho ? ` (${f.imagen.ancho}×${f.imagen.altoPx} px)` : '';
      l.push(`- imagen: ${f.imagen.nombre}${medidas}  ⚠ archivo local: hay que añadirlo a src/assets/fondos/ recortado a la relación de arriba`);
    }
    l.push('');
  }

  const conFondo = Object.entries(ajustes.secciones).filter(([, s]) => s.modo === 'imagen' && s.imagen);
  if (conFondo.length > 0) {
    l.push('## Fondos de sección');
    for (const [id, s] of conFondo) {
      l.push(
        `- #${id}: imagen ${s.imagen?.nombre} · encuadre ${s.x}% ${s.y}% · ` +
          `velo ${s.velo}% · desenfoque ${s.desenfoque}px`,
      );
    }
    l.push('');
  }

  const retratos = Object.entries(ajustes.retratos).filter(([, r]) => r.x !== 50 || r.y !== 50);
  if (retratos.length > 0) {
    l.push('## Retratos (src/components/SpeakerCard.astro, hoy sin `object-position`)');
    for (const [clave, r] of retratos) l.push(`- ${clave}: "${r.x}% ${r.y}%"`);
    l.push('');
  }

  const textos = Object.values(ajustes.textos);
  if (textos.length > 0) {
    l.push('## Textos (van en src/data/es.ts y su par en en.ts)');
    for (const t of textos) {
      l.push(`- #${t.seccion} <${t.etiqueta}>`);
      l.push(`    antes: ${t.original}`);
      l.push(`    ahora: ${t.nuevo}`);
    }
    l.push('');
  }

  const problemas = diagnostico();
  if (problemas.length > 0) {
    l.push('## Avisos de accesibilidad');
    for (const p of problemas) l.push(`- ${p}`);
    l.push('');
  }

  if (l.length <= 4) l.push('(todavía sin cambios)');
  return l.join('\n');
}

/* --------------------------------------------------------------- controles */

function crear<K extends keyof HTMLElementTagNameMap>(
  etiqueta: K,
  clase = '',
  texto = '',
): HTMLElementTagNameMap[K] {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto) el.textContent = texto;
  return el;
}

function alCambiar(): void {
  aplicar();
  guardar();
}

function marcarActivo(contenedor: HTMLElement, boton: HTMLElement): void {
  for (const b of contenedor.querySelectorAll('button')) b.classList.remove('activo');
  boton.classList.add('activo');
}

interface OpcionesDeslizador {
  etiqueta: string;
  min: number;
  max: number;
  paso: number;
  unidad?: string;
  leer: () => number;
  escribir: (v: number) => void;
}

function deslizador(o: OpcionesDeslizador): HTMLElement {
  const fila = crear('div', 'fila');
  const rotulo = crear('label', 'rotulo');
  const nombre = crear('span', '', o.etiqueta);
  const valor = crear('span', 'valor', `${o.leer()}${o.unidad ?? ''}`);
  rotulo.append(nombre, valor);

  const entrada = crear('input');
  entrada.type = 'range';
  entrada.min = String(o.min);
  entrada.max = String(o.max);
  entrada.step = String(o.paso);
  entrada.value = String(o.leer());
  entrada.addEventListener('input', () => {
    const v = Number(entrada.value);
    o.escribir(v);
    valor.textContent = `${v}${o.unidad ?? ''}`;
    alCambiar();
  });

  rotulo.append(entrada);
  fila.append(rotulo);
  return fila;
}

/**
 * Reduce la imagen antes de guardarla. Sin esto, una fotografía de cámara o de
 * Gemini —3,58 MB, 2752×1536 en el caso que lo motivó— no cabe en `localStorage`
 * y el borrador se pierde en cada recarga. 1800 px de ancho sobran: la franja
 * nunca pinta más de 166 px de alto `[medido: 2026-09-22]`.
 *
 * Es solo para *ver*. El archivo que se instale en `src/assets/fondos/` sale del
 * original, no de esta reducción.
 */
function reducir(archivo: File): Promise<ImagenCargada> {
  return new Promise((resolver, rechazar) => {
    const img = new Image();
    const url = URL.createObjectURL(archivo);
    img.addEventListener('load', () => {
      const ANCHO_MAX = 1800;
      const escala = Math.min(1, ANCHO_MAX / img.naturalWidth);
      const lienzo = document.createElement('canvas');
      lienzo.width = Math.round(img.naturalWidth * escala);
      lienzo.height = Math.round(img.naturalHeight * escala);
      lienzo.getContext('2d')?.drawImage(img, 0, 0, lienzo.width, lienzo.height);
      URL.revokeObjectURL(url);
      resolver({
        nombre: archivo.name,
        datos: lienzo.toDataURL('image/webp', 0.82),
        ancho: img.naturalWidth,
        altoPx: img.naturalHeight,
      });
    });
    img.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      rechazar(new Error('no se pudo leer la imagen'));
    });
    img.src = url;
  });
}

function cargadorDeImagen(etiqueta: string, alCargar: (img: ImagenCargada | null) => void): HTMLElement {
  const fila = crear('div', 'fila');
  fila.append(crear('span', 'rotulo', etiqueta));

  const entrada = crear('input');
  entrada.type = 'file';
  entrada.accept = 'image/*';
  entrada.addEventListener('change', () => {
    const archivo = entrada.files?.[0];
    if (!archivo) return;
    void reducir(archivo)
      .then((img) => {
        alCargar(img);
        alCambiar();
        avisar(
          `${img.nombre}: ${img.ancho}×${img.altoPx} px, reducida a 1800 px de ancho para el borrador. ` +
            'El archivo que se instale saldrá del original.',
        );
        setTimeout(() => avisar(''), 5000);
      })
      .catch(() => avisar(`No se pudo leer ${archivo.name}.`));
  });

  const quitar = crear('button', 'menor', 'quitar');
  quitar.type = 'button';
  quitar.addEventListener('click', () => {
    entrada.value = '';
    alCargar(null);
    alCambiar();
  });

  fila.append(entrada, quitar);
  return fila;
}

function grupo(titulo: string): HTMLDetailsElement {
  const d = crear('details', 'grupo');
  d.open = true;
  d.append(crear('summary', '', titulo));
  return d;
}

/** Se construye tras cada carga del marco: las secciones se leen de la página. */
function montarControles(): void {
  const d = pagina();
  if (!d) return;
  controlesEl.textContent = '';

  /* --- vista --- */
  const gVista = grupo('Vista');
  const anchos: Array<[string, number]> = [
    ['móvil 390', 390],
    ['tableta 768', 768],
    ['portátil 1280', 1280],
    ['completo', 0],
  ];
  const filaAnchos = crear('div', 'fila botones');
  for (const [nombre, valor] of anchos) {
    const b = crear('button', 'menor', nombre);
    b.type = 'button';
    if (ajustes.vista.ancho === valor) b.classList.add('activo');
    b.addEventListener('click', () => {
      ajustes.vista.ancho = valor;
      alCambiar();
      marcarActivo(filaAnchos, b);
    });
    filaAnchos.append(b);
  }
  gVista.append(filaAnchos);

  const filaTema = crear('div', 'fila botones');
  for (const t of ['light', 'dark'] as Tema[]) {
    const b = crear('button', 'menor', t === 'light' ? 'claro' : 'oscuro');
    b.type = 'button';
    if (ajustes.vista.tema === t) b.classList.add('activo');
    b.addEventListener('click', () => {
      ajustes.vista.tema = t;
      alCambiar();
      marcarActivo(filaTema, b);
    });
    filaTema.append(b);
  }
  gVista.append(filaTema);

  const filaIdioma = crear('div', 'fila botones');
  for (const i of ['es', 'en'] as Idioma[]) {
    const b = crear('button', 'menor', i.toUpperCase());
    b.type = 'button';
    if (ajustes.vista.idioma === i) b.classList.add('activo');
    b.addEventListener('click', () => {
      ajustes.vista.idioma = i;
      guardar();
      marcarActivo(filaIdioma, b);
      marco.src = i === 'es' ? '/' : '/en/';
    });
    filaIdioma.append(b);
  }
  gVista.append(filaIdioma);
  controlesEl.append(gVista);

  /* --- franja de la sede --- */
  const f = ajustes.franja;
  const gFranja = grupo('Franja de la sede (el banner)');
  gFranja.append(
    deslizador({ etiqueta: 'encuadre ↔', min: 0, max: 100, paso: 1, unidad: '%', leer: () => f.x, escribir: (v) => (f.x = v) }),
    deslizador({ etiqueta: 'encuadre ↕', min: 0, max: 100, paso: 1, unidad: '%', leer: () => f.y, escribir: (v) => (f.y = v) }),
    deslizador({ etiqueta: 'zoom', min: 1, max: 2, paso: 0.01, unidad: '×', leer: () => f.escala, escribir: (v) => (f.escala = v) }),
    deslizador({ etiqueta: 'velo', min: 0, max: 80, paso: 1, unidad: '%', leer: () => f.velo, escribir: (v) => (f.velo = v) }),
    deslizador({
      etiqueta: 'desvanecido hacia la barra',
      min: 0,
      max: 60,
      paso: 1,
      unidad: '%',
      leer: () => f.desvanecido,
      escribir: (v) => (f.desvanecido = v),
    }),
    deslizador({ etiqueta: 'alto', min: 0.4, max: 2, paso: 0.05, unidad: '×', leer: () => f.alto, escribir: (v) => (f.alto = v) }),
    cargadorDeImagen('otra fotografía', (img) => (f.imagen = img)),
  );

  // Relación fija: la perilla que contesta «que se vea lo mismo en toda pantalla».
  const fijar = crear('label', 'fila interruptor');
  const casillaFija = crear('input');
  casillaFija.type = 'checkbox';
  casillaFija.checked = f.relacionFija;
  casillaFija.addEventListener('change', () => {
    f.relacionFija = casillaFija.checked;
    alCambiar();
  });
  fijar.append(casillaFija, crear('span', '', 'relación fija (mismo recorte en toda pantalla)'));
  notaRelacion = crear('p', 'nota');
  gFranja.append(
    fijar,
    deslizador({
      etiqueta: 'relación ancho : alto',
      min: 3,
      max: 16,
      paso: 0.01,
      unidad: ' : 1',
      leer: () => f.relacion,
      escribir: (v) => {
        f.relacion = v;
        f.relacionFija = true;
        casillaFija.checked = true;
      },
    }),
    notaRelacion,
  );
  controlesEl.append(gFranja);

  /* --- fondos de sección --- */
  for (const seccion of d.querySelectorAll<HTMLElement>('main > section[id]')) {
    const id = seccion.id;
    ajustes.secciones[id] ??= seccionPorOmision();
    const s = ajustes.secciones[id];
    const g = grupo(`Fondo de #${id}`);

    const filaModo = crear('div', 'fila botones');
    for (const modo of ['solido', 'imagen'] as ModoFondo[]) {
      const b = crear('button', 'menor', modo === 'solido' ? 'color sólido' : 'imagen');
      b.type = 'button';
      if (s.modo === modo) b.classList.add('activo');
      b.addEventListener('click', () => {
        s.modo = modo;
        alCambiar();
        marcarActivo(filaModo, b);
      });
      filaModo.append(b);
    }

    g.append(
      filaModo,
      cargadorDeImagen('imagen de fondo', (img) => {
        s.imagen = img;
        if (img) s.modo = 'imagen';
      }),
      deslizador({ etiqueta: 'encuadre ↔', min: 0, max: 100, paso: 1, unidad: '%', leer: () => s.x, escribir: (v) => (s.x = v) }),
      deslizador({ etiqueta: 'encuadre ↕', min: 0, max: 100, paso: 1, unidad: '%', leer: () => s.y, escribir: (v) => (s.y = v) }),
      deslizador({ etiqueta: 'velo', min: 0, max: 100, paso: 1, unidad: '%', leer: () => s.velo, escribir: (v) => (s.velo = v) }),
      deslizador({ etiqueta: 'desenfoque', min: 0, max: 20, paso: 1, unidad: 'px', leer: () => s.desenfoque, escribir: (v) => (s.desenfoque = v) }),
    );
    controlesEl.append(g);
  }

  /* --- retratos --- */
  const retratos = [...d.querySelectorAll<HTMLImageElement>('#expositores img')];
  if (retratos.length > 0) {
    const g = grupo('Retratos de expositores');
    retratos.forEach((img, i) => {
      const clave =
        img.closest('article, li, div')?.querySelector('h3, h2')?.textContent?.trim() || `retrato ${i + 1}`;
      img.dataset.retrato = clave;
      ajustes.retratos[clave] ??= { x: 50, y: 50 };
      const r = ajustes.retratos[clave];
      const sub = crear('div', 'subgrupo');
      sub.append(
        crear('p', 'subtitulo', clave),
        deslizador({ etiqueta: '↔', min: 0, max: 100, paso: 1, unidad: '%', leer: () => r.x, escribir: (v) => (r.x = v) }),
        deslizador({ etiqueta: '↕', min: 0, max: 100, paso: 1, unidad: '%', leer: () => r.y, escribir: (v) => (r.y = v) }),
      );
      g.append(sub);
    });
    controlesEl.append(g);
  }

  /* --- textos --- */
  const gTextos = grupo('Textos');
  const interruptor = crear('label', 'fila interruptor');
  const casilla = crear('input');
  casilla.type = 'checkbox';
  casilla.checked = editandoTextos;
  casilla.addEventListener('change', () => alternarEdicionDeTextos(casilla.checked));
  interruptor.append(casilla, crear('span', '', 'editar textos en la página'));
  gTextos.append(
    interruptor,
    crear(
      'p',
      'nota',
      'Con esto activo, hacé clic sobre cualquier título o párrafo de la página y escribí encima. ' +
        'Cada cambio queda anotado en el informe junto a su texto original.',
    ),
  );
  controlesEl.append(gTextos);

  aplicar();
  if (editandoTextos) alternarEdicionDeTextos(true);
}

/* ------------------------------------------------------------ instantáneas */

function instantaneas(): Record<string, Ajustes> {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_INSTANTANEAS) ?? '{}') as Record<string, Ajustes>;
  } catch {
    return {};
  }
}

function pintarInstantaneas(): void {
  const lista = document.getElementById('instantaneas') as HTMLElement;
  lista.textContent = '';
  const todas = instantaneas();
  const nombres = Object.keys(todas);
  if (nombres.length === 0) {
    lista.append(crear('p', 'nota', 'Todavía no guardaste ninguna.'));
    return;
  }
  for (const nombre of nombres) {
    const fila = crear('div', 'fila botones');
    const abrir = crear('button', 'menor crecer', nombre);
    abrir.type = 'button';
    abrir.addEventListener('click', () => {
      ajustes = { ...porOmision(), ...todas[nombre] };
      guardar();
      montarControles();
    });
    const borrar = crear('button', 'menor', '✕');
    borrar.type = 'button';
    borrar.title = `Borrar «${nombre}»`;
    borrar.addEventListener('click', () => {
      const resto = instantaneas();
      delete resto[nombre];
      localStorage.setItem(CLAVE_INSTANTANEAS, JSON.stringify(resto));
      pintarInstantaneas();
    });
    fila.append(abrir, borrar);
    lista.append(fila);
  }
}

/* ---------------------------------------------------------------- arranque */

marco.addEventListener('load', montarControles);

document.getElementById('guardar-instantanea')?.addEventListener('click', () => {
  const nombre = prompt('Nombre de la instantánea');
  if (!nombre) return;
  const todas = instantaneas();
  todas[nombre] = ajustes;
  try {
    localStorage.setItem(CLAVE_INSTANTANEAS, JSON.stringify(todas));
    pintarInstantaneas();
    avisar(`Instantánea «${nombre}» guardada.`);
    setTimeout(() => avisar(''), 2500);
  } catch {
    avisar('No cabe: alguna instantánea tiene fotografías demasiado grandes. Borrá una vieja y reintentá.');
  }
});

document.getElementById('copiar')?.addEventListener('click', () => {
  void navigator.clipboard.writeText(informe()).then(() => {
    avisar('Informe copiado. Pegalo en el chat.');
    setTimeout(() => avisar(''), 2500);
  });
});

document.getElementById('restablecer')?.addEventListener('click', () => {
  const seguro = confirm(
    'Se descarta el borrador actual. Las instantáneas guardadas no se tocan. ¿Seguir?',
  );
  if (!seguro) return;
  ajustes = porOmision();
  editandoTextos = false;
  guardar();
  marco.contentWindow?.location.reload();
});

pintarInstantaneas();

// El marco arranca en `/` porque es lo que dice su atributo `src`. Si el borrador
// venia en ingles, se corrige aqui, antes de que nadie toque un control.
if (ajustes.vista.idioma === 'en' && !new URL(marco.src, location.href).pathname.startsWith('/en')) {
  marco.src = '/en/';
}
