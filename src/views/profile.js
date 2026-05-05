import OwnListingCard from '../components/ownListingCard.js';
import { fetchOwnListings } from '../services/fetchOwnListings.js';
import CreateNewListing from '../components/createNewListing.js';
import { getAuthState } from '../state/authState.js';
import { fetchMyBidsListings } from '../services/fetchMyBidsListings.js';
import myBidsCard from '../components/myBidsCard.js';

export default async function Profile() {
  const user = getAuthState();
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  let cachedListings = null;
  let cachedBids = null;

  const container = document.createElement('div');
  container.className = 'w-full mx-auto p-4';

  const title = document.createElement('h1');
  title.className = 'text-3xl text-text text-center font-bold mb-4';
  title.textContent = 'My Profile';

  const profileInfoContainer = document.createElement('section');
  profileInfoContainer.className =
    'flex flex-col md:flex-row bg-header p-4 rounded items-center justify-center gap-6';

  const fallback = `${import.meta.env.BASE_URL}images/lemonmascot-1.png`;
  const profileImage = document.createElement('img');
  profileImage.src = user?.avatar?.url || fallback;
  profileImage.alt = 'Profile Picture';
  profileImage.className =
    'w-32 h-32 rounded-full object-cover border-2 border-primary';

  const profileInfo = document.createElement('section');
  profileInfo.className =
    'bg-card border-2 border-text text-text rounded-lg p-4 max-w-md w-full';
  profileInfo.innerHTML = `
      <h2 class="text-2xl font-poppins font-semibold mb-2">User Information</h2>
      <p><strong>Name:</strong> ${user?.name || 'Unknown'}</p>
      <p><strong>Email:</strong> ${user?.email || 'Unknown'}</p>
      <p><strong>Address:</strong> ${user?.address || 'Unknown'}</p>
      <p><strong>Phone:</strong> ${user?.phone || 'Unknown'}</p>
    `;

  const hr = document.createElement('hr');
  hr.className = 'my-4 border-text';

  function setActiveButton(activeBtn, inactiveBtn) {
    activeBtn.classList.add('bg-primary');
    activeBtn.classList.remove('bg-secondary');
    inactiveBtn.classList.add('bg-secondary');
    inactiveBtn.classList.remove('bg-primary');
  }

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex justify-center mb-4 gap-4';

  const newListing = document.createElement('button');
  newListing.className = 'btn-primary bg-secondary mb-4';
  newListing.textContent = '+ Create New Listing';

  newListing.addEventListener('click', () => {
    CreateNewListing();
  });

  const ownListingButton = document.createElement('button');
  ownListingButton.className = 'btn-primary bg-secondary mb-4';
  ownListingButton.textContent = 'My Listings';

  const myBidsButton = document.createElement('button');
  myBidsButton.className = 'btn-primary bg-secondary mb-4';
  myBidsButton.textContent = 'My Bids';

  myBidsButton.addEventListener('click', async () => {
    const base = import.meta.env.BASE_URL || '';
    history.pushState({}, '', `${base}profile?tab=bids`);

    setActiveButton(myBidsButton, ownListingButton);
    if (!cachedBids) {
      cachedBids = await fetchMyBidsListings();
    }
    renderListings(cachedBids, myBidsCard);
    try {
      const listings = await fetchMyBidsListings();
      ownListingSection.innerHTML = '';
      listings.forEach((listing) => {
        ownListingSection.appendChild(myBidsCard(listing));
      });
      if (!listings.length) {
        ownListingSection.textContent = 'No bids found.';
      }
    } catch (error) {
      ownListingSection.textContent =
        'Error loading your bids. Please try again later.';
    }
  });

  ownListingButton.addEventListener('click', async () => {
    const base = import.meta.env.BASE_URL || '';
    history.pushState({}, '', `${base}profile?tab=listings`);
    setActiveButton(ownListingButton, myBidsButton);
    if (!cachedListings) {
      cachedListings = await fetchOwnListings();
    }
    renderListings(cachedListings, OwnListingCard);
    try {
      const listings = await fetchOwnListings();
      renderListings(listings, OwnListingCard);
    } catch (error) {
      showToast('Error loading your listings. Please try again later.');
    }
  });

  function renderListings(listings, cardComponent) {
    // fade out
    ownListingSection.classList.add('opacity-0');

    setTimeout(() => {
      ownListingSection.innerHTML = '';

      if (listings.length === 0) {
        ownListingSection.textContent = 'No listings found.';
      } else {
        listings.forEach((listing) => {
          ownListingSection.appendChild(cardComponent(listing));
        });
      }

      // fade in
      ownListingSection.classList.remove('opacity-0');
    }, 150);
  }

  const ownListingSection = document.createElement('section');
  ownListingSection.className =
    'mt-6 md:w-2/3 grid grid-cols-1 auto-rows h-full mx-auto md:grid-cols-1 gap-4 transition-opacity duration-300';

  container.appendChild(title);
  container.appendChild(profileInfoContainer);
  profileInfoContainer.appendChild(profileImage);
  profileInfoContainer.appendChild(profileInfo);
  container.appendChild(hr);
  container.appendChild(buttonContainer);
  buttonContainer.appendChild(newListing);
  buttonContainer.appendChild(ownListingButton);
  buttonContainer.appendChild(myBidsButton);

  container.appendChild(ownListingSection);

  try {
    if (tab === 'bids') {
      setActiveButton(myBidsButton, ownListingButton);

      const listings = await fetchMyBidsListings();
      renderListings(listings, myBidsCard);
    } else {
      // default = listings
      setActiveButton(ownListingButton, myBidsButton);

      const listings = await fetchOwnListings();
      renderListings(listings, OwnListingCard);
    }
  } catch (error) {
    ownListingSection.textContent =
      'Error loading data. Please try again later.';
  }
  return container;
}
