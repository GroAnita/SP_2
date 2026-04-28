export default function ListingDetail(listing) {
  const container = document.createElement('div');
  container.className = 'container flex w-3/4 mx-auto p-4';

  const title = document.createElement('h1');
  title.className = 'text-3xl font-bold mb-4';
  title.textContent = listing.title;

  const rightSection = document.createElement('div');
  rightSection.className = 'flex-1 p-4';

  const carouselWrapper = document.createElement('div');
  carouselWrapper.className =
    'relative w-full border-2 border-red-500 h-96 mb-6';

  const carousel = document.createElement('div');
  carousel.className = 'w-full h-full overflow-hidden rounded-lg';

  const imagesContainer = document.createElement('div');
  imagesContainer.className = 'flex transition-transform duration-500 h-full';

  const media = listing.media || [];

  media.forEach((mediaItem) => {
    const img = document.createElement('img');
    img.src = mediaItem.url;
    img.alt = listing.title;
    img.className = 'w-full h-full object-cover flex-shrink-0';
    imagesContainer.appendChild(img);
  });

  carousel.appendChild(imagesContainer);
  carouselWrapper.appendChild(carousel);

  container.appendChild(rightSection);
  container.appendChild(title);
  rightSection.appendChild(carouselWrapper);

  return container;
}
