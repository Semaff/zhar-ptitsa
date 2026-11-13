const dialog = document.querySelector('.photo-dialog');

if (typeof dialog?.showModal === 'function') {
  const toolbar = document.querySelector('.gallery-toolbar');
  const filters = [...toolbar.querySelectorAll('[data-filter]')];
  const photos = [...document.querySelectorAll('.gallery-item')];
  const largePhoto = dialog.querySelector('#photo-large');
  let visiblePhotos = photos;
  let opener;
  let photoIndex = 0;

  function applyFilter(activeFilter) {
    const filter = activeFilter.dataset.filter;
    filters.forEach((button) => button.setAttribute('aria-pressed', String(button === activeFilter)));
    photos.forEach((photo) => { photo.hidden = filter !== 'all' && photo.dataset.category !== filter; });
    visiblePhotos = photos.filter((photo) => !photo.hidden);
  }

  function showPhoto(index) {
    photoIndex = (index + visiblePhotos.length) % visiblePhotos.length;
    const link = visiblePhotos[photoIndex];
    const thumbnail = link.querySelector('img');
    const width = thumbnail.getAttribute('width');
    const height = thumbnail.getAttribute('height');
    largePhoto.width = width;
    largePhoto.height = height;
    largePhoto.style.setProperty('--photo-ratio', width / height);
    largePhoto.alt = thumbnail.alt;
    largePhoto.src = link.href;
  }

  filters.forEach((button) => button.addEventListener('click', () => applyFilter(button)));
  applyFilter(filters[0]);
  toolbar.hidden = false;

  photos.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      opener = link;
      showPhoto(visiblePhotos.indexOf(link));
      dialog.showModal();
    });
  });

  dialog.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => showPhoto(photoIndex + Number(button.dataset.step)));
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(photoIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.querySelector('.photo-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
}
