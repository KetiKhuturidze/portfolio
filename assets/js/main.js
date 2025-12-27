// Current year
document.getElementById('y').textContent = new Date().getFullYear();

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Project modal logic (hash-based deep links)
(function () {
  const modalBackdrop = document.getElementById('project-modal');
  if (!modalBackdrop) return;

  const closeBtn = modalBackdrop.querySelector('.modal-close');
  const detailBlocks = modalBackdrop.querySelectorAll('.project-detail');
  const cards = document.querySelectorAll('.gcard[data-project]');
  let isOpen = false;

  function lockBody(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  function showProject(slug, fromHash) {
    let found = false;

    detailBlocks.forEach((block) => {
      if (block.dataset.project === slug) {
        block.classList.add('active');
        found = true;
      } else {
        block.classList.remove('active');
      }
    });

    if (!found) return;

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    isOpen = true;
    lockBody(true);

    if (!fromHash) {
      const newHash = '#project-' + slug;
      if (window.location.hash !== newHash) {
        history.pushState(null, '', newHash);
      }
    }
  }

  function closeModal(manageHash) {
    if (!isOpen) return;

    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    isOpen = false;
    lockBody(false);

    if (manageHash) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  }

  // Card clicks
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = card.dataset.project;
      if (slug) showProject(slug, false);
    });
  });

  // Close button
  closeBtn.addEventListener('click', () => closeModal(true));

  // Backdrop click closes
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal(true);
    }
  });

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(true);
    }
  });

  // Handle hash-based deep linking
  function handleHashChange() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#project-')) {
      const slug = hash.slice('#project-'.length);
      if (slug) {
        showProject(slug, true);
      }
    } else if (isOpen) {
      closeModal(false);
    }
  }

  window.addEventListener('hashchange', handleHashChange);

  // Initial load
  handleHashChange();
})();
