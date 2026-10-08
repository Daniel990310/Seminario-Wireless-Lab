/**
 * Criterios de `specs/003-difusion-redes/requirements.md` que se miden dentro del lienzo.
 *
 * `medirLienzo` corre en el navegador (`page.evaluate`): por eso es autocontenida y no usa
 * nada de fuera. Devuelve una lista `{ id, ok, detalle }`, un resultado por criterio, que
 * `generar-flyer.mjs` junta con los que se miden fuera (QR, PDF, texto alternativo) y vuelca
 * en `specs/003-difusion-redes/verification.md`.
 *
 * Lo que la lámina debe contener lo declara ella misma en `data-flyer-esperado` sobre el
 * `<body>` (ver `CartelFlyer.astro`): así el criterio no adivina qué lámina está mirando.
 */
export function medirLienzo({ seguro, ancho, alto, piso, pisoPie = piso, grilla34 }) {
  const res = [];
  const marca = (id, ok, detalle = '') => res.push({ id, ok, detalle });
  const esperado = JSON.parse(document.body.dataset.flyerEsperado || '{}');
  const caja = document.querySelector('[data-flyer-contenido]');
  if (!caja) return [{ id: 'RF-23.1', ok: false, detalle: 'no hay [data-flyer-contenido]' }];

  const conTexto = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const textos = [...caja.querySelectorAll('*')].filter(conTexto);
  const imagenes = [...caja.querySelectorAll('img')];
  const visibles = [...textos, ...imagenes];
  const nombre = (el) => (el.textContent || el.getAttribute('src') || el.tagName).trim().slice(0, 40);
  const caso = (lista) => (lista.length ? lista.slice(0, 3).join(' · ') : '');

  /* RF-23.2 · zona segura de la interfaz (arriba y abajo). */
  const fueraVertical = visibles.filter((el) => {
    const r = el.getBoundingClientRect();
    return r.height && (r.top < seguro.arriba || r.bottom > alto - seguro.abajo);
  });
  marca('RF-23.2', !fueraVertical.length, caso(fueraVertical.map(nombre)));

  /* RF-23.3 · recorte 3:4 de la grilla de Instagram, solo en 4:5. */
  if (grilla34) {
    const margen = (ancho - (alto * 3) / 4) / 2;
    const fuera = visibles.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width && (r.left < margen || r.right > ancho - margen);
    });
    marca('RF-23.3', !fuera.length, caso(fuera.map(nombre)));
  }

  /* RF-24.1 · piso tipográfico; la mención de financiamiento, letra legal, tiene el suyo. */
  const chicos = textos.filter(
    (el) => parseFloat(getComputedStyle(el).fontSize) < (el.closest('[data-flyer-mencion]') ? pisoPie : piso),
  );
  marca('RF-24.1', !chicos.length, caso(chicos.map((el) => `${getComputedStyle(el).fontSize} «${nombre(el)}»`)));

  /*
   * RF-24.2 · contraste del texto contra el fondo opaco más cercano. No ve la figura de
   * fondo, que son trazos finos al 65 %: el criterio mide el par de tokens, y la figura se
   * revisa en la hoja de contacto (RF-30.1).
   */
  const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => {
    const c = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const fondo = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const c = rgb(getComputedStyle(n).backgroundColor);
      if (c.length >= 3 && (c[3] === undefined || c[3] > 0.99)) return c;
    }
    return [255, 255, 255];
  };
  const pobres = [];
  for (const el of textos) {
    const cs = getComputedStyle(el);
    const a = lum(rgb(cs.color));
    const b = lum(fondo(el));
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const tam = parseFloat(cs.fontSize);
    // Texto grande de WCAG (24 px, o 18,66 px en negrita) llevado al lienzo: escala 0,361.
    const grande = tam >= 66 || (tam >= 52 && Number(cs.fontWeight) >= 600);
    if (ratio < (grande ? 3 : 4.5)) pobres.push(`${ratio.toFixed(2)}:1 «${nombre(el)}»`);
  }
  marca('RF-24.2', !pobres.length, caso(pobres));

  /*
   * RF-24.3 · nada desborda, se corta ni se monta sobre el QR. Lo último cubre los renglones
   * `whitespace-nowrap` de la pieza única: si uno se alarga, invade el QR y no desborda.
   */
  const desborde = caja.scrollHeight - caja.clientHeight;
  const cortados = [...caja.querySelectorAll('*')].filter(
    (el) => el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible',
  );
  const qr = caja.querySelector('[data-flyer-qr]');
  const qrCaja = qr?.getBoundingClientRect();
  const sobreQr = qrCaja
    ? visibles.filter((el) => {
        if (qr.contains(el)) return false;
        const r = el.getBoundingClientRect();
        return r.left < qrCaja.right - 1 && r.right > qrCaja.left + 1 && r.top < qrCaja.bottom - 1 && r.bottom > qrCaja.top + 1;
      })
    : [];
  const problema = desborde > 1 ? `desborda ${desborde} px` : sobreQr.length ? `sobre el QR: ${caso(sobreQr.map(nombre))}` : caso(cortados.map(nombre));
  marca('RF-24.3', desborde <= 1 && !cortados.length && !sobreQr.length, problema);

  /* RF-24.4 · aire mínimo entre el contenido y la franja de marcas, donde la hay. */
  const franja = document.querySelector('[data-flyer-marcas]');
  if (franja) {
    const borde = franja.getBoundingClientRect().top;
    const encima = visibles
      .filter((el) => !franja.contains(el))
      .map((el) => el.getBoundingClientRect().bottom)
      .filter((b) => b <= borde + 1);
    const aire = Math.round(borde - Math.max(...encima));
    marca('RF-24.4', aire >= 32, `${aire} px`);
  }

  /* RF-25.1 · como mucho tres familias: las del sitio. */
  const familias = new Set(textos.map((el) => getComputedStyle(el).fontFamily.split(',')[0].trim()));
  marca('RF-25.1', familias.size <= 3, [...familias].join(', '));

  /* RF-25.2 · lo que toda pieza dice: dominio y fecha; y el organizador donde corresponde. */
  const todo = caja.innerText.replace(/\s+/g, ' ');
  const faltan = [esperado.dominio, esperado.fecha, esperado.organizador].filter((x) => x && !todo.includes(x));
  marca('RF-25.2', !faltan.length, faltan.length ? `falta: ${faltan.join(', ')}` : '');

  /* RF-26.1 y RF-26.2 · logo del seminario: variante blanca, sobre su mínimo, sin estirar. */
  const logos = imagenes.filter((i) => i.dataset.logoSeminario);
  const minimo = { principal: 400, horizontal: 420 };
  const malos = logos.filter((i) => i.getBoundingClientRect().width < minimo[i.dataset.logoSeminario] - 0.5);
  marca('RF-26.1', logos.length === 1 && !malos.length, logos.length !== 1 ? `${logos.length} logos del seminario` : caso(malos.map((i) => `${Math.round(i.getBoundingClientRect().width)} px`)));
  const estirados = [...imagenes].filter((i) => {
    const r = i.getBoundingClientRect();
    if (!i.naturalWidth || !r.width || getComputedStyle(i).objectFit === 'cover') return false;
    return Math.abs(r.width / r.height / (i.naturalWidth / i.naturalHeight) - 1) > 0.02;
  });
  marca('RF-26.2', !estirados.length, caso(estirados.map(nombre)));

  /*
   * RF-26.3 a RF-26.5 · marcas institucionales: cuáles, en qué orden, con qué peso. RF-26.3
   * cubre además la fila de participantes: todas por nombre y fuera de la franja.
   */
  if (franja) {
    const piezas = [...franja.querySelectorAll('[data-marca]')];
    const ids = piezas.map((p) => p.dataset.marca).sort();
    const intrusas = [...franja.querySelectorAll('img')].filter((i) => !i.dataset.marca);
    const hay = [...caja.querySelectorAll('[data-participante]')].map((i) => i.dataset.participante);
    const faltan = (esperado.participantes ?? []).filter((n) => !hay.includes(n));
    const ok = JSON.stringify(ids) === JSON.stringify([...esperado.marcas].sort()) && !intrusas.length && !faltan.length;
    marca(
      'RF-26.3',
      ok,
      faltan.length ? `faltan participantes: ${faltan.join(', ')}` : ok ? '' : `hay ${ids.join(', ')}${intrusas.length ? ' + imágenes sin marca' : ''}`,
    );

    const anid = piezas.find((p) => p.dataset.marca === 'anid')?.getBoundingClientRect();
    const resto = piezas.filter((p) => p.dataset.marca !== 'anid').map((p) => p.getBoundingClientRect());
    marca('RF-26.4', !!anid && resto.every((r) => r.right <= anid.left + 1), 'ANID a la derecha de las demás');

    const area = (r) => r.width * r.height;
    const conImagen = piezas.filter((p) => p.tagName === 'IMG').map((p) => [p.dataset.marca, area(p.getBoundingClientRect())]);
    const ref = conImagen.find(([m]) => m === 'anid')?.[1];
    const desparejas = conImagen.filter(([, a]) => ref && (a / ref < 0.72 || a / ref > 1.7));
    marca('RF-26.5', !!ref && !desparejas.length, caso(conImagen.map(([m, a]) => `${m} ${(a / ref).toFixed(2)}×`)));
  }

  /* RF-26.6 · la fórmula de ANID y el folio de cada proyecto, donde la lámina la lleva. */
  if (esperado.mencion) {
    const sinFolio = (esperado.folios ?? []).filter((f) => !todo.includes(f));
    marca('RF-26.6', todo.includes(esperado.mencion) && !sinFolio.length, sinFolio.length ? `sin folio: ${sinFolio.join(', ')}` : '');
  }

  /* RF-28.3 · hueco del sticker libre, en las historias de portada. */
  const hueco = document.querySelector('[data-flyer-sticker]')?.getBoundingClientRect();
  if (hueco) {
    const dentro = visibles.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.left < hueco.right && r.right > hueco.left && r.top < hueco.bottom && r.bottom > hueco.top;
    });
    marca('RF-28.3', hueco.width >= 600 && hueco.height >= 170 && !dentro.length, caso(dentro.map(nombre)));
  }

  /* RF-29.4 · todas las imágenes cargaron. */
  const rotas = [...document.images].filter((i) => !i.complete || !i.naturalWidth);
  marca('RF-29.4', !rotas.length, caso(rotas.map((i) => i.src)));

  return res;
}
