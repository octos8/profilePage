(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = header.querySelector('.nav-toggle');
  const nav = header.querySelector('.site-nav');
  if (!toggle || !nav) return;
  let collapsed = false;
  let open = false;
  function render() {
    header.classList.toggle('is-scrolled', collapsed);
    header.classList.toggle('is-menu-open', open);
    toggle.hidden = !collapsed;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    nav.hidden = collapsed && !open;
  }
  function closeMenu(returnFocus = false) {
    open = false;
    render();
    if (returnFocus && collapsed) toggle.focus({ preventScroll: true });
  }
  function updateHeader() {
    const next = window.scrollY > 24;
    if (next !== collapsed) {
      const focused = document.activeElement;
      collapsed = next;
      open = false;
      render();
      if (collapsed && nav.contains(focused)) toggle.focus({ preventScroll: true });
      if (!collapsed && focused === toggle) nav.querySelector('a')?.focus({ preventScroll: true });
    }
  }
  toggle.addEventListener('click', () => { open = !open; render(); });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu(nav.contains(document.activeElement));
  });
  document.addEventListener('click', (event) => {
    if (open && !header.contains(event.target)) closeMenu(nav.contains(document.activeElement));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) { event.preventDefault(); closeMenu(true); }
  });
  header.addEventListener('focusout', (event) => {
    if (open && !header.contains(event.relatedTarget)) closeMenu();
  });
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('pageshow', updateHeader);
  render();
  updateHeader();
})();

(function () {
  const intro = document.querySelector('.intro-scroll');
  const stage = intro?.querySelector('.intro-sticky');
  const hero = intro?.querySelector('.hero');
  const works = intro?.querySelector('.work-preview');
  if (!intro || !stage || !hero || !works) return;
  const simpleView = window.matchMedia('(prefers-reduced-motion: reduce), (max-height: 40.625rem)');
  const clamp = (value) => Math.min(1, Math.max(0, value));
  const phase = (progress, start, end) => clamp((progress - start) / (end - start));
  let framePending = false;
  function distance() { return Math.max(intro.offsetHeight - stage.offsetHeight, 1); }
  function render() {
    framePending = false;
    intro.classList.toggle('is-ready', !simpleView.matches);
    if (simpleView.matches) { hero.inert = false; works.inert = false; return; }
    const progress = clamp(-intro.getBoundingClientRect().top / distance());
    const decorationOut = phase(progress, 0, .30);
    const heroOut = phase(progress, .08, .36);
    const workIn = phase(progress, .36, .78);
    const properties = {
      '--decoration-opacity': 1 - decorationOut,
      '--decoration-scale': 1 + decorationOut * .18,
      '--hero-opacity': 1 - heroOut,
      '--hero-y': `${-40 * heroOut}px`,
      '--work-opacity': workIn,
      '--work-scale': .82 + workIn * .18,
      '--work-y': `${80 * (1 - workIn)}px`
    };
    Object.entries(properties).forEach(([name, value]) => { intro.style.setProperty(name, String(value)); });
    hero.inert = progress >= .4; works.inert = progress < .4;
  }
  function requestRender() { if (framePending) return; framePending = true; requestAnimationFrame(render); }
  function goToScene(hash, behavior = 'auto', focus = false) {
    if (simpleView.matches || !['#about', '#work-preview'].includes(hash)) return false;
    const target = hash === '#about' ? hero : works;
    const start = window.scrollY + intro.getBoundingClientRect().top;
    const progress = hash === '#about' ? 0 : .8;
    window.scrollTo({ top: start + distance() * progress, behavior });
    if (focus) { target.inert = false; target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    requestRender(); return true;
  }
  document.querySelectorAll('a[href="#about"], a[href="#work-preview"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || simpleView.matches) return;
      event.preventDefault(); const hash = link.getAttribute('href'); goToScene(hash, 'smooth', true);
      if (location.hash !== hash) history.pushState(null, '', hash);
    });
  });
  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender); window.addEventListener('pageshow', requestRender);
  window.addEventListener('hashchange', () => { goToScene(location.hash); });
  window.addEventListener('load', () => { goToScene(location.hash); requestRender(); });
  if (simpleView.addEventListener) simpleView.addEventListener('change', requestRender);
  render();
})();

(() => {

  const accordions = document.querySelectorAll('.design-accordion');
  accordions.forEach((accordion) => {
    const panels = [...accordion.querySelectorAll('.design-accordion-panel')];
    let autoplayTimer;
    function restartAutoplay() {
      window.clearInterval(autoplayTimer);
      if (panels.length < 2) return;
      autoplayTimer = window.setInterval(() => {
        const current = panels.findIndex((panel) => panel.classList.contains('is-active'));
        activatePanel(panels[(current + 1) % panels.length]);
      }, 2500);
    }
    function activatePanel(selectedPanel) {
      panels.forEach((panel) => {
        const active = panel === selectedPanel;
        panel.classList.toggle('is-active', active);
        const button = panel.querySelector('.design-accordion-button');
        button?.setAttribute('aria-expanded', String(active));
      });
      if (window.matchMedia('(max-width: 64rem)').matches) {
        const left = accordion.scrollLeft + selectedPanel.getBoundingClientRect().left - accordion.getBoundingClientRect().left;
        accordion.scrollTo({
          left,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
        });
      }
      restartAutoplay();
    }
    panels.forEach((panel) => {
      const button = panel.querySelector('.design-accordion-button');
      if (!button) return;
      button.setAttribute('aria-expanded', String(panel.classList.contains('is-active')));
      button.addEventListener('click', () => {
        activatePanel(panel);
      });
      button.addEventListener('mouseenter', () => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          activatePanel(panel);
        }
      });
      button.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
          return;
        }
        event.preventDefault();
        const current = panels.indexOf(panel);
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const next = (current + direction + panels.length) % panels.length;
        activatePanel(panels[next]);
        panels[next].querySelector('.design-accordion-button')?.focus();
      });
    });
    restartAutoplay();
  });
})();

(() => {
  const button = document.querySelector('.back-to-top');
  if (!button) return;
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  });
})();
