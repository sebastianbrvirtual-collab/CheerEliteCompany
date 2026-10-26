// ===========================
// BURGER MENU (móvil)
// ===========================
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

if (burger) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navActions.classList.toggle('open');
    // Animar burger
    burger.classList.toggle('active');
  });
}

// ===========================
// VISOR DE GALERÍA (carrusel lateral)
// ===========================
const galeria = [
  { src: 'imagenes/eventos/4.jpg', titulo: 'Ganadores Cheerleading - Torneo', info: 'Medellín, Colombia | 28 Sep 2025' , posicion: 'center 20%', likes: 142, liked: false },
  { src: 'imagenes/eventos/5.jpg', titulo: 'Campeonato Nacional de Cheerleading', info: 'Bogotá, Colombia | 12 Oct 2025', likes: 98, liked: false },
  { src: 'imagenes/eventos/6.jpg', titulo: 'Open Cheer Challenge', info: 'Cali, Colombia | 14 Nov 2025', posicion: 'center 20%', likes: 215, liked: false },
  { src: 'imagenes/eventos/7.jpg', titulo: 'Copa de Cheerleading', info: 'Bucaramanga, Colombia | 30 Ene 2026', likes: 76, liked: false },
];

let currentImg = 0;

const viewerImg     = document.getElementById('viewerImg');
const viewerPrev    = document.getElementById('viewerPrev');
const viewerNext    = document.getElementById('viewerNext');
const viewerCounter = document.querySelector('.viewer-counter');
const viewerCapH    = document.querySelector('.viewer-caption h4');
const viewerCapP    = document.querySelector('.viewer-caption p');

function updateViewer() {
  if (!viewerImg) return;
  const item = galeria[currentImg];
  viewerImg.src = item.src;
  viewerImg.alt = item.titulo;
  viewerImg.style.objectPosition = item.posicion || 'center center';
  if (viewerCounter) viewerCounter.textContent = `${currentImg + 1} / ${galeria.length}`;
  if (viewerCapH)    viewerCapH.textContent    = item.titulo;
  if (viewerCapP)    viewerCapP.textContent    = item.info;
  renderHeart();
}

if (viewerPrev) {
  viewerPrev.addEventListener('click', () => {
    currentImg = (currentImg - 1 + galeria.length) % galeria.length;
    updateViewer();
  });
}

if (viewerNext) {
  viewerNext.addEventListener('click', () => {
    currentImg = (currentImg + 1) % galeria.length;
    updateViewer();
  });
}

// ===========================
// BOTÓN CORAZÓN (independiente por foto, se guarda en el navegador)
// ===========================
const heartBtn = document.querySelector('.viewer-btn-icon .fa-heart')?.parentElement;
const likesGuardados = JSON.parse(localStorage.getItem('fotosFavoritas') || '{}');

function renderHeart() {
  if (!heartBtn) return;
  const currentPhoto = galeria[currentImg];
  const icon = heartBtn.querySelector('i');

  const isLiked = !!likesGuardados[currentPhoto.src];
  icon.classList.toggle('fas', isLiked);
  icon.classList.toggle('far', !isLiked);
  icon.style.color = isLiked ? '#f43f5e' : '';
}

if (heartBtn) {
  heartBtn.addEventListener('click', () => {
    const currentPhoto = galeria[currentImg];

    if (likesGuardados[currentPhoto.src]) {
      delete likesGuardados[currentPhoto.src];
    } else {
      likesGuardados[currentPhoto.src] = true;
    }

    localStorage.setItem('fotosFavoritas', JSON.stringify(likesGuardados));
    renderHeart();
  });
}

// ===========================
// NAVBAR — cambio de color al scroll
// ===========================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.background = 'rgba(10, 10, 10, 0.98)';
  } else {
    navbar.style.background = 'rgba(10, 10, 10, 0.95)';
  }
});

// ===========================
// SMOOTH SCROLL en links del nav
// ===========================
document.querySelectorAll('a[href="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => e.preventDefault());
});

// ===========================
// BUSCADOR DEL HERO
// ===========================
const heroInput  = document.querySelector('.hero-search input');
const heroBuscar = document.querySelector('.btn-buscar');

function normalizarTexto(txt) {
  return (txt || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function quitarMensajeBusqueda() {
  const viejo = document.querySelector('.hero-search-msg');
  if (viejo) viejo.remove();
}

function mostrarMensajeBusqueda(texto) {
  quitarMensajeBusqueda();
  const caja = document.querySelector('.hero-search');
  if (!caja) return;
  const msg = document.createElement('p');
  msg.className = 'hero-search-msg';
  msg.textContent = texto;
  caja.insertAdjacentElement('afterend', msg);
}

function buscarEvento() {
  if (!heroInput) return;
  const consulta = normalizarTexto(heroInput.value);
  if (!consulta) return;

  const tarjetas = [...document.querySelectorAll('.evento-card')];
  const encontrada = tarjetas.find(card =>
    normalizarTexto(card.textContent).includes(consulta)
  );

  if (!encontrada) {
    mostrarMensajeBusqueda(`No encontramos eventos con "${heroInput.value.trim()}".`);
    return;
  }

  quitarMensajeBusqueda();

  const enProximos = Boolean(encontrada.closest('#vista-proximos'));
  const vista = enProximos ? vistaProximos : vistaEventos;

  mostrarVista(vista, 'navEventos');

  requestAnimationFrame(() => {
    encontrada.scrollIntoView({ behavior: 'smooth', block: 'center' });
    encontrada.classList.add('evento-resaltado');
    setTimeout(() => encontrada.classList.remove('evento-resaltado'), 2500);
  });
}

if (heroInput && heroBuscar) {
  heroInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buscarEvento();
    }
  });

  heroBuscar.addEventListener('click', buscarEvento);
}

// ===========================
// PLANES — resaltar plan al hacer hover
// ===========================
document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    document.querySelectorAll('.plan-card').forEach(c => {
      if (c !== card && !c.classList.contains('popular')) {
        c.style.opacity = '0.7';
      }
    });
  });
  card.addEventListener('mouseleave', () => {
    document.querySelectorAll('.plan-card').forEach(c => {
      c.style.opacity = '1';
    });
  });
});

// ===========================
// BOTÓN AGRANDAR
// ===========================
const expandBtn = document.querySelector('.viewer-btn-icon .fa-expand')?.parentElement;

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Cerrar"><i class="fas fa-times"></i></button>
  <button class="lightbox-nav prev" aria-label="Anterior"><i class="fas fa-chevron-left"></i></button>
  <div class="lightbox-content">
    <img class="lightbox-img" alt="" />
    <div class="lightbox-watermark">CheerEliteCompany</div>
  </div>
  <button class="lightbox-nav next" aria-label="Siguiente"><i class="fas fa-chevron-right"></i></button>
`;
document.body.appendChild(lightbox);

const lbImg = lightbox.querySelector('.lightbox-img');

function updateLightbox() {
  const item = galeria[currentImg];
  lbImg.src = item.src;
  lbImg.alt = item.titulo;
}

function openLightbox() {
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxMove(dir) {
  currentImg = (currentImg + dir + galeria.length) % galeria.length;
  updateViewer();    // mantiene sincronizado el visor pequeño
  updateLightbox();
}

if (expandBtn) expandBtn.addEventListener('click', openLightbox);

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.prev').addEventListener('click', () => lightboxMove(-1));
lightbox.querySelector('.next').addEventListener('click', () => lightboxMove(1));

// Cerrar al hacer clic en el fondo oscuro
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Teclado: Esc cierra, flechas navegan
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxMove(-1);
  if (e.key === 'ArrowRight') lightboxMove(1);
});

// ===========================
// VISTAS INTERNAS (eventos / productos / próximos)
// ===========================
const vistaEventos   = document.getElementById('vista-eventos');
const vistaProductos = document.getElementById('vista-productos');
const vistaProximos  = document.getElementById('vista-proximos');

const vistas = [vistaEventos, vistaProductos, vistaProximos].filter(Boolean);

const seccionesInicio = [...document.body.children].filter(el =>
  !vistas.includes(el) && !el.matches('nav, footer, script, link, style')
);

function ocultarTodo() {
  seccionesInicio.forEach(el => el.hidden = true);
  vistas.forEach(v => v.hidden = true);
}

function mostrarVista(vista, idNav) {
  ocultarTodo();
  if (vista) vista.hidden = false;
  window.scrollTo(0, 0);
  if (idNav) marcarActivo(idNav);
}

function mostrarInicio() {
  ocultarTodo();
  seccionesInicio.forEach(el => el.hidden = false);
  window.scrollTo(0, 0);
  marcarActivo('navInicio');
}

function enlazar(idBoton, vista, idNav) {
  const el = document.getElementById(idBoton);
  if (el) el.addEventListener('click', e => {
    e.preventDefault();
    mostrarVista(vista, idNav);
  });
}

enlazar('verTodosEventos',   vistaEventos,   'navEventos');
enlazar('navEventos',        vistaEventos,   'navEventos');
enlazar('verTodosProductos', vistaProductos, 'navProductos');
enlazar('navProductos',      vistaProductos, 'navProductos');
enlazar('verTodosProximos',  vistaProximos,  'navEventos');
enlazar('verTodosEventos',   vistaEventos,   'navEventos');
enlazar('navEventos',        vistaEventos,   'navEventos');
enlazar('verTodosProductos', vistaProductos, 'navProductos');
enlazar('verMasProductos',   vistaProductos, 'navProductos');
enlazar('navProductos',      vistaProductos, 'navProductos');
enlazar('verTodosProximos',  vistaProximos,  'navEventos');

const navInicio = document.getElementById('navInicio');
if (navInicio) {
  navInicio.addEventListener('click', e => {
    e.preventDefault();
    mostrarInicio();
  });
}

['volverInicio', 'volverInicioProd', 'volverInicioProx'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', mostrarInicio);
});

// ===========================
// NAVBAR — enlace activo
// ===========================
const navItems = document.querySelectorAll('.nav-link');

function marcarActivo(id) {
  navItems.forEach(l => l.classList.remove('active'));
  const link = document.getElementById(id);
  if (link) link.classList.add('active');
}

navItems.forEach(link => {
  link.addEventListener('click', () => {
    navItems.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

updateViewer();

// ===========================
// EVENTOS DESDE data/eventos.json
// ===========================
const MESES_CORTOS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function formatearFecha(iso) {
  if (!iso) return '';
  const [anio, mes, dia] = iso.split('-').map(Number);
  if (!anio || !mes || !dia) return iso;
  return `${dia} ${MESES_CORTOS[mes - 1]} ${anio}`;
}

function tarjetaDestacado(ev) {
  return `
    <div class="evento-card">
      <div class="evento-img-wrap">
        <img src="${ev.imagen}" alt="${ev.titulo}" loading="lazy" />
      </div>
      <div class="evento-info">
        <p class="evento-date"><i class="far fa-calendar"></i> ${formatearFecha(ev.fecha)}</p>
        <h3 class="evento-name">${ev.titulo}</h3>
        <p class="evento-loc"><i class="fas fa-map-marker-alt"></i> ${ev.lugar}</p>
      </div>
    </div>`;
}

function tarjetaEvento(ev) {
  return `
    <article class="evento-card">
      <div class="evento-img">
        <img src="${ev.imagen}" alt="${ev.titulo}" loading="lazy" />
      </div>
      <div class="evento-info">
        <span class="evento-fecha"><i class="far fa-calendar"></i> ${formatearFecha(ev.fecha)}</span>
        <h3>${ev.titulo}</h3>
        <p class="evento-lugar"><i class="fas fa-map-marker-alt"></i> ${ev.lugar}</p>
      </div>
    </article>`;
}

async function cargarEventos() {
  const gridDestacados = document.getElementById('gridDestacados');
  const gridEventos    = document.getElementById('gridEventos');
  if (!gridDestacados && !gridEventos) return;

  try {
    const respuesta = await fetch('data/eventos.json');
    if (!respuesta.ok) throw new Error('No se encontró data/eventos.json');
    const { eventos = [] } = await respuesta.json();

    if (gridDestacados) {
      gridDestacados.innerHTML = eventos
        .filter(ev => ev.destacado)
        .map(tarjetaDestacado)
        .join('');
    }

    if (gridEventos) {
      gridEventos.innerHTML = eventos.map(tarjetaEvento).join('');
    }
  } catch (error) {
    console.error('Error al cargar los eventos:', error);
  }
}

cargarEventos();
