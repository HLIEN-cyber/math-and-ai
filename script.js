const cards = Array.from(document.querySelectorAll('.project-card'));
const searchInput = document.querySelector('#search');
const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
const resultsCount = document.querySelector('#results-count');
const resetButton = document.querySelector('#reset');

const modal = document.querySelector('[data-modal]');
const modalCategory = document.querySelector('[data-modal-category]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalSummary = document.querySelector('[data-modal-summary]');
const modalLink = document.querySelector('[data-modal-link]');
const copiedLabel = document.querySelector('.copied');

function updateResults() {
  const term = searchInput.value.trim().toLowerCase();
  const activeFilter = filterButtons.find((btn) => btn.classList.contains('active'))?.dataset.filter ?? 'all';

  let visibleCount = 0;
  cards.forEach((card) => {
    const title = card.dataset.title.toLowerCase();
    const summary = card.dataset.summary.toLowerCase();
    const matchesSearch = !term || title.includes(term) || summary.includes(term);
    const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
    const show = matchesSearch && matchesFilter;
    card.style.display = show ? '' : 'none';
    if (show) visibleCount += 1;
  });

  resultsCount.textContent = `符合條件的專案：${visibleCount} / ${cards.length}`;
}

function setActiveFilter(target) {
  filterButtons.forEach((btn) => btn.classList.toggle('active', btn === target));
  updateResults();
}

function openModal(card) {
  modalCategory.textContent = card.querySelector('.badge').textContent;
  modalTitle.textContent = card.dataset.title;
  modalSummary.textContent = card.dataset.summary;
  modalLink.href = card.querySelector('a').href;
  copiedLabel.hidden = true;
  modal.showModal();
}

function copyLink() {
  if (!modalLink.href) return;
  navigator.clipboard.writeText(modalLink.href).then(() => {
    copiedLabel.hidden = false;
    setTimeout(() => (copiedLabel.hidden = true), 2000);
  });
}

searchInput.addEventListener('input', updateResults);
filterButtons.forEach((btn) => btn.addEventListener('click', () => setActiveFilter(btn)));
cards.forEach((card) => {
  const detailBtn = card.querySelector('.open-detail');
  detailBtn.addEventListener('click', () => openModal(card));
});

resetButton.addEventListener('click', () => {
  searchInput.value = '';
  setActiveFilter(filterButtons[0]);
});

document.querySelector('[data-close]').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});
document.querySelector('[data-copy]').addEventListener('click', copyLink);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.open) modal.close();
});

// Initialize
updateResults();
