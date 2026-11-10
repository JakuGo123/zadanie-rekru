/* Vanilla JS. No build step and no network dependencies. */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.mobile-toggle');
  const navigation = document.querySelector('.navigation');
  const navTriggers = [...document.querySelectorAll('.nav-trigger')];

  // Two visual layers allow the requested colour crossfade using opacity only.
  // The dark layer is decorative; links and buttons remain single focus targets.
  document.querySelectorAll('.tone').forEach(element => {
    const light = document.createElement('span');
    light.className = 'tone-light';
    while (element.firstChild) light.append(element.firstChild);
    const dark = light.cloneNode(true);
    dark.className = 'tone-dark';
    dark.setAttribute('aria-hidden', 'true');
    element.append(light, dark);
  });

  function closeDropdowns() {
    navTriggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
      document.getElementById(trigger.getAttribute('aria-controls')).hidden = true;
    });
  }

  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    menuToggle.querySelectorAll('use').forEach(icon => icon.setAttribute('href', open ? '#i-close' : '#i-menu'));
    if (!open) closeDropdowns();
  }

  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  navTriggers.forEach(trigger => trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') !== 'true';
    closeDropdowns();
    trigger.setAttribute('aria-expanded', String(open));
    document.getElementById(trigger.getAttribute('aria-controls')).hidden = !open;
  }));
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setMenu(false);
  });
  header.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const expanded = navTriggers.find(trigger => trigger.getAttribute('aria-expanded') === 'true');
    if (expanded) { closeDropdowns(); expanded.focus(); }
    else if (header.classList.contains('menu-open')) { setMenu(false); menuToggle.focus(); }
  });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) setMenu(false);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  window.matchMedia('(min-width: 1001px)').addEventListener('change', () => setMenu(false));

  const hero = document.querySelector('.hero');
  const slides = [...hero.querySelectorAll('.slide')];
  const dots = [...hero.querySelectorAll('[data-goto]')];
  const pauseButton = hero.querySelector('.slider-pause');
  const announcement = document.getElementById('slider-announcement');
  const lamps = [...hero.querySelectorAll('.lamp')];
  const DURATION = 3000;
  let activeIndex = 0;
  let elapsed = 0;
  let lastTime = null;
  let frameId = 0;
  let userPaused = reducedMotion.matches;
  let focusPaused = false;
  let lampHovered = false;
  let heroVisible = true;

  function isPlaying() {
    return !userPaused && !focusPaused && !lampHovered && !document.hidden && heroVisible && !reducedMotion.matches;
  }

  function updatePauseButton() {
    const paused = userPaused || reducedMotion.matches;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Wznów zmianę slajdów' : 'Wstrzymaj zmianę slajdów');
    pauseButton.querySelector('use').setAttribute('href', paused ? '#i-play' : '#i-pause');
    // Reduced motion keeps manual navigation, without an inoperative play button.
    pauseButton.hidden = reducedMotion.matches;
  }

  function showSlide(index, manual = false) {
    resetScene();
    lampHovered = false;
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === activeIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === activeIndex);
      if (i === activeIndex) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    elapsed = 0;
    lastTime = null;
    hero.style.setProperty('--progress', '0');
    if (manual) announcement.textContent = slides[activeIndex].getAttribute('aria-label');
    syncPlayback();
  }

  function tick(time) {
    frameId = 0;
    if (!isPlaying()) { lastTime = null; return; }
    if (lastTime !== null) elapsed += Math.min(time - lastTime, 100);
    lastTime = time;
    if (elapsed >= DURATION) {
      showSlide(activeIndex + 1);
      return; // showSlide schedules the next frame; never create a second loop.
    }
    hero.style.setProperty('--progress', String(Math.min(elapsed / DURATION, 1)));
    frameId = requestAnimationFrame(tick);
  }

  function syncPlayback() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = null;
    if (isPlaying()) frameId = requestAnimationFrame(tick);
  }

  hero.querySelector('.slider-prev').addEventListener('click', () => showSlide(activeIndex - 1, true));
  hero.querySelector('.slider-next').addEventListener('click', () => showSlide(activeIndex + 1, true));
  dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.goto), true)));
  pauseButton.addEventListener('click', () => {
    userPaused = !userPaused;
    updatePauseButton();
    syncPlayback();
  });
  hero.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(activeIndex + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  // Pause while interacting with slide content, but allow the play control to work.
  hero.addEventListener('focusin', event => {
    focusPaused = !!event.target.closest('.slide');
    syncPlayback();
  });
  hero.addEventListener('focusout', event => {
    focusPaused = !!event.relatedTarget?.closest('.slide');
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    syncPlayback();
  }, { threshold: 0 }).observe(hero);
  reducedMotion.addEventListener('change', () => {
    userPaused = reducedMotion.matches;
    updatePauseButton();
    syncPlayback();
    resetScene();
  });

  lamps.forEach(lamp => {
    lamp.addEventListener('click', () => {
      const on = lamp.getAttribute('aria-pressed') !== 'true';
      lamp.setAttribute('aria-pressed', String(on));
      lamp.setAttribute('aria-label', `${on ? 'Wyłącz' : 'Włącz'} ${lamp.dataset.color} lampę`);
    });
    // Let people explore each lamp without the slide changing underneath them.
    lamp.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      lampHovered = true;
      syncPlayback();
    });
    lamp.addEventListener('pointerleave', () => {
      lampHovered = false;
      syncPlayback();
    });
  });
  let pointerFrame = 0;
  hero.addEventListener('pointermove', event => {
    if (reducedMotion.matches || event.pointerType !== 'mouse' || activeIndex !== 0) return;
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * 2 - 1;
      const y = (event.clientY - rect.top) / rect.height * 2 - 1;
      const scale = Math.min(rect.width / 1920, 1);
      lamps.forEach(lamp => {
        const depth = Number(lamp.dataset.depth);
        lamp.style.setProperty('--lamp-x', `${x * depth * 24 * scale}px`);
        lamp.style.setProperty('--lamp-y', `${y * depth * 16 * scale}px`);
        lamp.style.setProperty('--lamp-rotation', `${x * depth * 1.4}deg`);
      });
      pointerFrame = 0;
    });
  });
  function resetScene() {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    lamps.forEach(lamp => {
      lamp.style.setProperty('--lamp-x', '0px');
      lamp.style.setProperty('--lamp-y', '0px');
      lamp.style.setProperty('--lamp-rotation', '0deg');
    });
  }
  hero.addEventListener('pointerleave', resetScene);

  // Swipe ignores taps and vertical scrolling; buttons keep their normal behaviour.
  let touchStart = null;
  hero.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  hero.addEventListener('touchend', event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) showSlide(activeIndex + (dx < 0 ? 1 : -1), true);
    touchStart = null;
  }, { passive: true });

  const dialog = document.querySelector('.cookie-dialog');
  document.querySelector('.cookie-settings').addEventListener('click', () => dialog.showModal());
  dialog.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

  updatePauseButton();
  syncPlayback();
})();
