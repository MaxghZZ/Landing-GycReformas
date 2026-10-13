'use strict';

// Actualiza estos dos valores cuando GYC confirme sus datos reales.
const BUSINESS = Object.freeze({
  whatsapp: '34611234567',
  phoneLabel: '+34 611 23 45 67',
});

const bySelector = (selector, scope = document) => scope.querySelector(selector);
const bySelectorAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function configureBusinessLinks() {
  const whatsappUrl = `https://wa.me/${BUSINESS.whatsapp}`;

  bySelectorAll('[data-whatsapp-link]').forEach((link) => {
    link.href = whatsappUrl;
  });

  bySelectorAll('[data-business-phone]').forEach((element) => {
    element.textContent = BUSINESS.phoneLabel;
  });
}

function setupMobileNavigation() {
  const toggle = bySelector('[data-menu-toggle]');
  const navigation = bySelector('[data-mobile-nav]');

  if (!toggle || !navigation) return;

  const closeNavigation = () => {
    toggle.classList.remove('is-open');
    navigation.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    bySelector('.sr-only', toggle).textContent = 'Abrir menú';
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.classList.toggle('is-open', !isOpen);
    navigation.classList.toggle('is-open', !isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
    bySelector('.sr-only', toggle).textContent = isOpen ? 'Abrir menú' : 'Cerrar menú';
  });

  bySelectorAll('a', navigation).forEach((link) => link.addEventListener('click', closeNavigation));
}

function setupHeaderShadow() {
  const header = bySelector('[data-header]');
  if (!header) return;

  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

function setupActiveNavigation() {
  const links = bySelectorAll('.desktop-nav a[href^="#"]');
  const sections = links
    .map((link) => bySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (links.length === 0 || sections.length === 0) return;

  const setActiveLink = (id) => {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (visibleSection) setActiveLink(visibleSection.target.id);
  }, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: [0, 0.2, 0.5],
  });

  sections.forEach((section) => observer.observe(section));
  links.forEach((link) => link.addEventListener('click', () => {
    setActiveLink(link.getAttribute('href').slice(1));
  }));
}

function setupImageFallbacks() {
  bySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => image.classList.add('is-missing'));
  });
}

function setupHeroSlider() {
  const image = bySelector('#hero-image');
  const dots = bySelectorAll('[data-slide-image]');
  const previous = bySelector('[data-previous-slide]');
  const next = bySelector('[data-next-slide]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentIndex = 0;
  let intervalId;

  if (!image || dots.length === 0) return;

  const showSlide = (index) => {
    currentIndex = (index + dots.length) % dots.length;
    const activeDot = dots[currentIndex];

    image.classList.remove('is-missing');
    const nextImage = new Image();

    nextImage.onload = () => {
      image.src = nextImage.src;
      image.alt = activeDot.dataset.slideAlt;
    };

    nextImage.src = activeDot.dataset.slideImage;


    /*image.style.opacity = '0';
    window.setTimeout(() => {
      image.src = activeDot.dataset.slideImage;
      image.alt = activeDot.dataset.slideAlt;
      image.style.opacity = '';
    }, 180);
*/
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle('is-active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  const restartAutoplay = () => {
    window.clearInterval(intervalId);
    if (!reducedMotion) intervalId = window.setInterval(() => showSlide(currentIndex + 1), 6500);
  };

  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    showSlide(index);
    restartAutoplay();
  }));
  previous?.addEventListener('click', () => { showSlide(currentIndex - 1); restartAutoplay(); });
  next?.addEventListener('click', () => { showSlide(currentIndex + 1); restartAutoplay(); });
  image.addEventListener('error', () => image.classList.add('is-missing'));

  restartAutoplay();
}

function setupGallery() {
  const dialog = bySelector('[data-gallery-dialog]');
  const image = bySelector('[data-gallery-image]');
  const caption = bySelector('[data-gallery-caption]');
  const counter = bySelector('[data-gallery-counter]');
  const closeButton = bySelector('[data-gallery-close]');
  const previousButton = bySelector('[data-gallery-previous]');
  const nextButton = bySelector('[data-gallery-next]');

  if (!dialog || !image || !caption || !counter || !closeButton || !previousButton || !nextButton) return;

  const photos = [
    { src: 'assets/images/gallery-kitchen-dining.webp', alt: 'Cocina y comedor reformados por GYC' },
    { src: 'assets/images/gallery-kitchen-beams.webp', alt: 'Cocina reformada con vigas vistas' },
    { src: 'assets/images/gallery-dining-room.webp', alt: 'Comedor reformado con suelo de madera' },
    { src: 'assets/images/gallery-kitchen-white.webp', alt: 'Cocina blanca de una reforma terminada' },
    { src: 'assets/images/gallery-kitchen-detail.webp', alt: 'Cocina blanca reformada con acabados en madera' },
    { src: 'assets/images/gallery-kitchen-window.webp', alt: 'Cocina reformada con luz natural' },
    { src: 'assets/images/gallery-bathroom-shower.webp', alt: 'Ducha terminada en baño reformado' },
    { src: 'assets/images/gallery-bathroom-floral.webp', alt: 'Baño terminado con revestimiento decorativo' },
    { src: 'assets/images/gallery-bathroom-glass.webp', alt: 'Baño renovado con mampara de cristal' },
    { src: 'assets/images/gallery-bathroom-neutral.webp', alt: 'Baño reformado en tonos neutros' },
    { src: 'assets/images/gallery-bathroom-vanity.webp', alt: 'Baño reformado con mueble de madera y espejo circular' },
    { src: 'assets/images/gallery-hallway-floor.webp', alt: 'Pasillo renovado con suelo de madera' },
    { src: 'assets/images/gallery-open-floor.webp', alt: 'Estancia terminada con pavimento de madera' },
    { src: 'assets/images/gallery-kitchen-compact.webp', alt: 'Cocina compacta de una reforma integral' },
    { src: 'assets/images/gallery-kitchen-island.webp', alt: 'Cocina reformada con isla y luminarias colgantes' },
    { src: 'assets/images/gallery-carpentry-door.webp', alt: 'Puerta de madera instalada por GYC' },
    { src: 'assets/images/gallery-interior-finish.webp', alt: 'Interior amplio completamente renovado' },
    { src: 'assets/images/gallery-bathroom-modern.webp', alt: 'Baño moderno terminado con ducha y mueble suspendido' },
  ];

  let activeIndex = 0;
  let lastTrigger;

  const renderPhoto = () => {
    const photo = photos[activeIndex];
    image.src = photo.src;
    image.alt = photo.alt;
    caption.textContent = photo.alt;
    counter.textContent = `${activeIndex + 1} / ${photos.length}`;
  };

  const closeGallery = () => {
    dialog.hidden = true;
    dialog.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-gallery-open');
    lastTrigger?.focus();
  };

  const openGallery = (index, trigger) => {
    activeIndex = Number.isInteger(index) && index >= 0 && index < photos.length ? index : 0;
    lastTrigger = trigger;
    renderPhoto();
    dialog.hidden = false;
    dialog.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-gallery-open');
    window.requestAnimationFrame(() => closeButton.focus());
  };

  const changePhoto = (step) => {
    activeIndex = (activeIndex + step + photos.length) % photos.length;
    renderPhoto();
  };

  bySelectorAll('[data-gallery-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openGallery(Number.parseInt(trigger.dataset.galleryIndex, 10), trigger);
    });
  });

  closeButton.addEventListener('click', closeGallery);
  previousButton.addEventListener('click', () => changePhoto(-1));
  nextButton.addEventListener('click', () => changePhoto(1));

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeGallery();
  });

  window.addEventListener('keydown', (event) => {
    if (dialog.hidden) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowLeft') changePhoto(-1);
    if (event.key === 'ArrowRight') changePhoto(1);
  });
}

function setupQuoteForm() {
  const form = bySelector('[data-quote-form]');
  const status = bySelector('[data-form-status]');
  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const fields = new FormData(form);
    const message = [
      'Hola, quiero solicitar un presupuesto.',
      `Nombre: ${fields.get('name')}`,
      `Teléfono: ${fields.get('phone')}`,
      `Email: ${fields.get('email')}`,
      `Tipo de reforma: ${fields.get('service')}`,
      `Proyecto: ${fields.get('project')}`,
    ].join('\n');

    status.textContent = 'Abriendo WhatsApp…';
    window.location.assign(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`);
  });
}

configureBusinessLinks();
setupMobileNavigation();
setupHeaderShadow();
setupActiveNavigation();
setupImageFallbacks();
setupHeroSlider();
setupGallery();
setupQuoteForm();
