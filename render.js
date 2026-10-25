// ===========================
// CONTENIDO DINÁMICO (data/*.json)
// El contenido se edita desde /admin, no desde aquí.
// ===========================
(function () {
  const BASE = 'data/';

  const esc = (v) =>
    String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  async function cargar(archivo) {
    try {
      const res = await fetch(BASE + archivo, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status + ' ' + archivo);
      return await res.json();
    } catch (err) {
      console.warn('[contenido] No se pudo cargar', archivo, err);
      return null;
    }
  }

  const pintar = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  const texto = (id, valor) => {
    const el = document.getElementById(id);
    if (el && valor) el.textContent = valor;
  };

  // ---------- Portada ----------
  async function portada() {
    const d = await cargar('inicio.json');
    if (!d) return;
    texto('heroLabel', d.etiqueta);
    texto('heroTitle', d.titulo);
    texto('heroHighlight', d.destacado);
    texto('heroSubtitle', d.subtitulo);
  }

  // ---------- Plantillas ----------
  const cardDestacado = (e) => `
    <div class="evento-card">
      <div class="evento-img-wrap">
        <img src="${esc(e.imagen)}" alt="${esc(e.titulo)}" loading="lazy" />
      </div>
      <div class="evento-info">
        <p class="evento-date"><i class="far fa-calendar"></i> ${esc(e.fecha)}</p>
        <h3 class="evento-name">${esc(e.titulo)}</h3>
        <p class="evento-loc"><i class="fas fa-map-marker-alt"></i> ${esc(e.lugar)}</p>
      </div>
    </div>`;

  const cardEvento = (e) => `
    <article class="evento-card">
      <div class="evento-img">
        <img src="${esc(e.imagen)}" alt="${esc(e.titulo)}" loading="lazy" />
      </div>
      <div class="evento-info">
        <span class="evento-fecha"><i class="far fa-calendar"></i> ${esc(e.fecha)}</span>
        <h3>${esc(e.titulo)}</h3>
        <p class="evento-lugar"><i class="fas fa-map-marker-alt"></i> ${esc(e.lugar)}</p>
      </div>
    </article>`;

  const cardProducto = (p) => `
    <article class="evento-card">
      <div class="evento-img">
        <img src="${esc(p.imagen)}" alt="${esc(p.nombre)}" loading="lazy" />
      </div>
      <div class="evento-info">
        <span class="producto-precio">${esc(p.precio)}</span>
        <h3>${esc(p.nombre)}</h3>
        <p class="evento-lugar"><i class="${esc(p.icono || 'fas fa-camera')}"></i> ${esc(p.detalle)}</p>
      </div>
    </article>`;

  // ---------- Secciones ----------
  async function eventos() {
    const d = await cargar('eventos.json');
    if (!d || !Array.isArray(d.eventos)) return;
    const todos = d.eventos;
    const marcados = todos.filter((e) => e.destacado === true);
    const destacados = marcados.length ? marcados : todos.slice(0, 6);
    pintar('gridDestacados', destacados.map(cardDestacado).join(''));
    pintar('gridEventos', todos.map(cardEvento).join(''));
  }

  async function productos() {
    const d = await cargar('productos.json');
    if (!d || !Array.isArray(d.productos)) return;
    pintar('gridProductos', d.productos.map(cardProducto).join(''));
  }

  async function proximos() {
    const d = await cargar('proximos.json');
    if (!d || !Array.isArray(d.proximos)) return;
    pintar('gridProximos', d.proximos.map(cardEvento).join(''));
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([portada(), eventos(), productos(), proximos()]);
    document.dispatchEvent(new Event('contenidoListo'));
  });
})();