(() => {
  const intro = document.querySelector('.intro-scroll');
  const stage = intro?.querySelector('.intro-sticky');
  const hero = intro?.querySelector('.hero');
  const works = intro?.querySelector('.work-preview');
  if (!intro || !stage || !hero || !works) return;

  const simpleView = window.matchMedia(
    '(prefers-reduced-motion: reduce), (max-height: 650px)'
  );
  const clamp = (value) => Math.min(1, Math.max(0, value));
  const phase = (progress, start, end) => clamp((progress - start) / (end - start));
  let framePending = false;

  function distance() {
    return Math.max(intro.offsetHeight - stage.offsetHeight, 1);
  }

  function render() {
    framePending = false;
    intro.classList.toggle('is-ready', !simpleView.matches);
    if (simpleView.matches) {
      hero.inert = false;
      works.inert = false;
      return;
    }

    const progress = clamp(-intro.getBoundingClientRect().top / distance());
    const decorationOut = phase(progress, 0, .3);
    const heroOut = phase(progress, .08, .36);
    const workIn = phase(progress, .36, .78);
    const properties = {
      '--decoration-opacity': 1 - decorationOut,
      '--decoration-scale': 1 + decorationOut * .18,
      '--hero-opacity': 1 - heroOut,
      '--hero-y': `${-40 * heroOut}px`,
      '--work-opacity': workIn,
      '--work-scale': .82 + workIn * .18,
      '--work-y': `${80 * (1 - workIn)}px`,
    };
    Object.entries(properties).forEach(([name, value]) => {
      intro.style.setProperty(name, String(value));
    });
    hero.inert = progress >= .4;
    works.inert = progress < .4;
  }

  function requestRender() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(render);
  }

  // 고정된 화면 안의 앵커도 해당 장면의 스크롤 위치로 이동합니다.
  function goToScene(hash, behavior = 'auto', focus = false) {
    if (simpleView.matches || !['#about', '#work-preview'].includes(hash)) return false;
    const target = hash === '#about' ? hero : works;
    const start = window.scrollY + intro.getBoundingClientRect().top;
    const progress = hash === '#about' ? 0 : .8;
    window.scrollTo({ top: start + distance() * progress, behavior });
    if (focus) {
      target.inert = false;
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    requestRender();
    return true;
  }

  document.querySelectorAll('a[href="#about"], a[href="#work-preview"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || simpleView.matches) return;
      event.preventDefault();
      const hash = link.getAttribute('href');
      // 즉시 이동해 보이지 않는 장면에 초점이 남지 않게 합니다.
      goToScene(hash, 'instant', true);
      if (location.hash !== hash) history.pushState(null, '', hash);
    });
  });

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender);
  window.addEventListener('pageshow', requestRender);
  window.addEventListener('hashchange', () => goToScene(location.hash));
  window.addEventListener('load', () => { goToScene(location.hash); requestRender(); });
  simpleView.addEventListener('change', requestRender);
  render();
})();
