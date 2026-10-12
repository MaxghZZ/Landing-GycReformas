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
setupImageFallbacks();
setupHeroSlider();
setupQuoteForm();
