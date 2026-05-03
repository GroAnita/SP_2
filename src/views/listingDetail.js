import { updateCountdown } from '../utils/countDown.js';
import bidModal from '../components/bidModal.js';
import { getAuthState } from '../state/authState.js';
import getHighestBidder from '../utils/getHighestBidder.js';

export default function ListingDetail(listing) {
  const currentUser = getAuthState();
  const container = document.createElement('div');
  container.className = 'container flex flex-col gap-6 w-full mx-auto p-4';

  const fallback = `${import.meta.env.BASE_URL}images/lemonmascot-1.png`;

  const media =
    listing.media && listing.media.length > 0
      ? listing.media
      : [{ url: fallback }];

  const title = document.createElement('h1');
  title.className = 'text-3xl text-text font-bold mb-4';
  title.textContent = listing.title;

  const gallery = document.createElement('div');
  gallery.className = 'flex gap-4 h-96';

  const thumbs = document.createElement('div');
  thumbs.className = 'flex flex-col gap-2 w-20 overflow-hidden';

  const mainImageWrapper = document.createElement('div');
  mainImageWrapper.className =
    'h-full md:w-[500px] w-full flex-shrink-0 overflow-hidden rounded-lg';

  const mainImage = document.createElement('img');
  mainImage.src = media[0].url || fallback;
  mainImage.className = 'w-full h-full object-cover';

  media.slice(0, 5).forEach((item, index) => {
    const thumb = document.createElement('img');
    thumb.src = item.url || fallback;
    thumb.className =
      'w-full h-16 object-cover cursor-pointer rounded opacity-70 hover:opacity-100 transition ';

    if (index === 0) {
      thumb.classList.add('ring-2', 'ring-primary', 'opacity-100');
    }
    thumb.addEventListener('click', () => {
      mainImage.src = item.url || fallback;
    });

    thumbs
      .querySelectorAll('img')
      .forEach((img) =>
        img.classList.remove('ring-2', 'ring-primary', 'opacity-100')
      );
    thumb.classList.add('ring-2', 'ring-primary', 'opacity-100');
    thumbs.appendChild(thumb);
  });

  mainImageWrapper.appendChild(mainImage);
  gallery.appendChild(thumbs);
  gallery.appendChild(mainImageWrapper);

  const info = document.createElement('div');
  info.className =
    ' border-2 border-text w-full md:w-2/5 text-center rounded-lg p-4 bg-card';

  const time = document.createElement('span');
  time.className = 'text-xl font-bold text-text mx-auto w-full card-time';

  const endTime = new Date(listing.endsAt);

  const intervalId = updateCountdown(time, endTime);
  time._intervalId = intervalId;

  const sellerWrapper = document.createElement('div');
  sellerWrapper.className = 'flex items-center gap-3';

  const sellerImg = document.createElement('img');
  sellerImg.src = listing.seller?.avatar?.url || fallback;
  sellerImg.alt = listing.seller?.name || 'Seller Image';
  sellerImg.className = 'w-12 h-12 rounded-full  mb-2 object-cover';

  const sellerInfo = document.createElement('div');
  sellerInfo.className = 'flex flex-col items-start';

  const sellerName = document.createElement('p');
  sellerName.textContent = `Seller: ${listing.seller?.name || 'Unknown'}`;
  sellerName.className = 'text-sm text-text';

  const sellerRating = document.createElement('p');
  const rating = listing.seller?.rating || 0;
  sellerRating.textContent = `Rating: ${rating.toFixed(1)} ⭐`;
  sellerRating.className = 'text-xs text-text';

  sellerInfo.appendChild(sellerName);
  sellerInfo.appendChild(sellerRating);
  sellerWrapper.appendChild(sellerImg);
  sellerWrapper.appendChild(sellerInfo);

  const timeWrapper = document.createElement('div');
  timeWrapper.className = 'text-xl font-bold text-primary ';

  timeWrapper.appendChild(time);
  info.appendChild(timeWrapper);

  const description = document.createElement('p');
  description.textContent = listing.description || 'No description available.';
  description.className = 'mb-4 text-sm text-text text-center';

  const bid = document.createElement('p');
  bid.textContent = `Current Bid: ${listing.bids?.length ? Math.max(...listing.bids.map((b) => b.amount)) : 0} credits`;
  bid.className = 'text-2xl font-bold text-secondary mt-1';

  const itemBids = document.createElement('p');
  itemBids.textContent = `(${listing.bids?.length || 0} bids)`;
  itemBids.className = 'text-sm text-text/60';

  const bidWrapper = document.createElement('div');
  bidWrapper.className = 'text-2xl font-bold text-secondary';
  const bidderStatus = document.createElement('p');
  bidderStatus.className = 'text-sm text-green-500 mt-1';

  const highest = listing.bids?.length
    ? listing.bids.reduce((max, b) => (b.amount > max.amount ? b : max))
    : null;

  const highestBidder = getHighestBidder(listing.bids);
  if (highest?.bidder?.name === currentUser?.name) {
    bidderStatus.textContent = 'You are the highest bidder!';
  } else {
    bidderStatus.textContent = '';
  }

  bidWrapper.appendChild(bid);
  bidWrapper.appendChild(itemBids);
  bidWrapper.appendChild(bidderStatus);

  const bidBtn = document.createElement('button');
  bidBtn.className =
    'mt-4 bg-primary text-gray-900 font-bold py-2 w-full rounded-lg border-2 border-text hover:scale-105 transition';
  bidBtn.textContent = 'Place Bid';

  bidBtn.addEventListener('click', (e) => {
    e.preventDefault();
    bidModal(listing);
  });

  const bidHistory = document.createElement('div');
  bidHistory.className = 'mt-4 flex flex-col gap-2 text-sm text-text text-left';

  function renderBidItem(bid) {
    const row = document.createElement('div');
    row.className = 'flex justify-between border-b border-text pb-1';

    const name = document.createElement('span');
    name.textContent = bid.bidder?.name || 'Unknown Bidder';

    const amount = document.createElement('span');
    amount.textContent = `${bid.amount} credits`;

    row.appendChild(name);
    row.appendChild(amount);
    return row;
  }

  const shippingSection = document.createElement('div');
  shippingSection.className = 'flex flex-col gap-3 text-left';

  const shippingTitle = document.createElement('h3');
  shippingTitle.textContent = '';
  shippingTitle.className = 'text-sm font-bold uppercase text-text';

  shippingSection.appendChild(shippingTitle);
  shippingSection.appendChild(createDivider());

  const shipping = document.createElement('div');
  shipping.className = 'text-sm text-text flex flex-col gap-1';
  shipping.innerHTML = `
  <p class="font-semibold">Shipping</p>
  <p>Fast delivery within 3-5 business days. Free shipping on orders over 100 credits.</p>
  <p class="text-xs text-text/60"> Location: Global Marketplace</p>
  `;

  const returns = document.createElement('div');
  returns.className = 'text-sm text-text flex flex-col gap-1';
  returns.innerHTML = `
  <p class="font-semibold">Returns</p>
  <p class="text-text/60 text-xs">No Returns. Please review the item details and ask any questions before bidding.</p>
  `;

  const payments = document.createElement('div');
  payments.className = 'text-sm text-text flex flex-col gap-1';
  payments.innerHTML = `
    <p class="font-semibold">Payments</p>
    <p>We accept all major credit cards and our platform credits. Payment is done with "Coins" that you buy before bidding , to ensure funds</p>
    `;

  shippingSection.appendChild(shipping);
  shippingSection.appendChild(createDivider());
  shippingSection.appendChild(returns);
  shippingSection.appendChild(createDivider());
  shippingSection.appendChild(payments);

  function createSection(titleText, contentEl) {
    const section = document.createElement('div');
    section.className = 'flex flex-col gap-2';

    const title = document.createElement('p');
    title.textContent = titleText;
    title.className = 'text-xs uppercase text-text/60 tracking-wide';

    section.appendChild(title);
    section.appendChild(contentEl);
    return section;
  }

  function createDivider() {
    const hr = document.createElement('hr');
    hr.className = 'my-4 border-text';
    return hr;
  }

  info.appendChild(createSection('Time Left', time));
  info.appendChild(createDivider());

  info.appendChild(createSection('Seller', sellerWrapper));
  info.appendChild(createDivider());

  info.appendChild(createSection('Current Bid', bidWrapper));
  info.appendChild(createDivider());

  info.appendChild(createSection('Description', description));

  info.appendChild(bidBtn);

  info.appendChild(createDivider());
  info.appendChild(createSection('Bid History', bidHistory));

  info.appendChild(createDivider());
  info.appendChild(createSection('Shipping & Returns', shippingSection));

  const contentRow = document.createElement('div');
  contentRow.className = 'flex flex-col md:flex-row gap-6 mx-auto';

  contentRow.appendChild(gallery);
  contentRow.appendChild(info);

  container.appendChild(title);
  container.appendChild(contentRow);

  const isActive = new Date(listing.endsAt) > new Date();
  if (!isActive) {
    bidBtn.disabled = true;
    bidBtn.classList.add('opacity-50', 'cursor-not-allowed');
    bidBtn.textContent = 'Auction Ended';
  }

  document.addEventListener('bid:placed', (e) => {
    const newBid = e.detail;
    console.log('New bid placed:', newBid);
    listing.bids = listing.bids || [];
    listing.bids.push(newBid);

    const highestBidder = getHighestBidder(listing.bids);
    if (highestBidder?.bidder?.name === currentUser?.name) {
      bidderStatus.textContent = 'You are the highest bidder!';
    } else {
      bidderStatus.textContent = '';
    }

    const newRow = renderBidItem(newBid);
    bidHistory.prepend(newRow);
    const highestBid = Math.max(...listing.bids.map((b) => b.amount));
    bid.textContent = `Current Bid: ${highestBid} credits`;
    itemBids.textContent = `(${listing.bids.length} bids)`;
  });
  return container;
}
