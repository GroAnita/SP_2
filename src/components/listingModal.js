export default function openListingModal(listing) {
  function updateSlider() {
    const offset = -currentIndex * 100;
    imagesContainer.style.transform = `translateY(${offset}%)`;
  }
  document
    .querySelectorAll('[data-modal="listing"]')
    .forEach((modal) => modal.remove());

  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  overlay.dataset.modal = 'listing';

  const modal = document.createElement('div');
  modal.className =
    'bg-card text-text flex rounded-lg max-w-5xl w-full relative';

  const rightSection = document.createElement('div');
  rightSection.className =
    'p-6 flex flex-col gap-4 flex-1 border-4 border-gray-300';

  const description = document.createElement('p');
  description.textContent = listing.description || 'No description available.';
  description.className = 'text-sm';

  const bids = listing.bids || [];
  const highestBid =
    bids.length > 0
      ? Math.max(...bids.map((bid) => bid.amount))
      : 'No bids yet';
  const bidInfo = document.createElement('p');
  bidInfo.textContent = `Highest Bid: ${highestBid} credits`;
  bidInfo.className = 'text-sm font-semibold';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'absolute top-2 right-2 text-text hover:text-primary';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    overlay.remove();
  });

  const title = document.createElement('h2');
  title.className = 'text-rxl text-primary font-bold mb-4';
  title.textContent = listing.title;

  const leftSection = document.createElement('div');
  leftSection.className = 'flex-1 p-4 flex items-center justify-center';

  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'relative w-full h-96 mb-6';

  const carousel = document.createElement('div');
  carousel.className = 'w-full h-full overflow-hidden rounded-lg';

  const midSection = document.createElement('div');
  midSection.className = 'flex-1 p-4';

  const imagesContainer = document.createElement('div');
  imagesContainer.className =
    'flex flex-col transition-transform duration-500 h-full';

  listing.media.forEach((media) => {
    const img = document.createElement('img');
    img.src = media.url;
    img.alt = listing.title;
    img.className = 'w-full h-full object-cover flex-shrink-0';
    imagesContainer.appendChild(img);
  });

  let currentIndex = 0;
  const totalSlides = listing.media.length;

  const upBtn = document.createElement('button');
  upBtn.textContent = '▲';
  upBtn.className =
    'absolute top-2 left-1/2 transform -translate-x-1/2 bg-primary text-white px-2 py-1 rounded';

  const downBtn = document.createElement('button');
  downBtn.textContent = '▼';
  downBtn.className =
    'absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-white px-2 py-1 rounded';

  upBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  downBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  });
  carousel.appendChild(imagesContainer);
  carouselWrapper.appendChild(upBtn);
  carouselWrapper.appendChild(downBtn);

  carouselWrapper.appendChild(carousel);
  leftSection.appendChild(carouselWrapper);
  rightSection.appendChild(title);
  rightSection.appendChild(description);
  rightSection.appendChild(bidInfo);
  modal.appendChild(leftSection);
  modal.appendChild(midSection);
  modal.appendChild(rightSection);
  modal.appendChild(closeBtn);

  modal.querySelector('button:last-child').addEventListener('click', () => {
    overlay.remove();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  return overlay;
}
