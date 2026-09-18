(() => {
  const section = document.querySelector('#product-page');
  const dialog = section?.querySelector('.product-page-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const image = dialog.querySelector('.product-page-full-image');
  const title = dialog.querySelector('#product-page-dialog-title');
  let previousOverflow = '';
  let activeCard = null;

  section.querySelectorAll('.product-page-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      activeCard = card;
      title.textContent = card.dataset.title;
      image.alt = card.dataset.title;
      image.src = card.href;
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.style.overflow = 'hidden';
    });
  });

  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    image.removeAttribute('src');
    activeCard?.focus({ preventScroll: true });
  });
})();
