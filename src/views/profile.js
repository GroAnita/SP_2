import OwnListingCard from '../components/ownListingCard.js';
import { fetchOwnListings } from '../services/fetchOwnListings.js';
import CreateNewListing from '../components/createNewListing.js';
import { getAuthState } from '../state/authState.js';
import { fetchMyBidsListings } from '../services/fetchMyBidsListings.js';
import myBidsCard from '../components/myBidsCard.js';
import { updateProfile } from '../services/profileUpdateService.js';
import showToast from '../ui/showToast.js';
import Breadcrumbs from '../components/breadcrumbs.js';

/**
 * Renders the Profile page view.
 *
 * Features:
 * - Displays user information (name, email, avatar, bio)
 * - Allows editing:
 *   - Avatar
 *   - Bio
 * - Displays tabs:
 *   - "My Listings"
 *   - "My Bids"
 * - Supports SPA navigation via query param (?tab=bids | listings)
 * - Uses caching to avoid unnecessary API calls
 *
 * Data sources:
 * - Auth state (localStorage via getAuthState)
 * - API:
 *   - fetchOwnListings()
 *   - fetchMyBidsListings()
 *   - updateProfile()
 *
 * UI behavior:
 * - Updates URL using history.pushState
 * - Renders listings dynamically using card components
 * - Handles "bid:placed" event to refresh bids in real-time
 *
 * Side effects:
 * - Updates localStorage when profile changes
 * - Dispatches and listens to custom events
 *
 * @async
 * @function Profile
 *
 * @returns {Promise<HTMLElement>} Fully rendered profile page container
 *
 * @example
 * import Profile from './views/profile.js';
 * const view = await Profile();
 * document.getElementById('app').appendChild(view);
 */
export default async function Profile() {
  const user = getAuthState();
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  let cachedListings = null;
  let cachedBids = null;

  const container = document.createElement('main');
  container.className = 'w-full mx-auto p-4';
  container.setAttribute('aria-labelledby', 'profile-heading');

  const breadcrumbs = Breadcrumbs([
    { label: 'Home', path: '/' },
    { label: 'Profile' },
  ]);

  container.appendChild(breadcrumbs);

  const pageTitle = document.createElement('h1');
  pageTitle.className = 'text-3xl text-text font-poppins font-bold mb-4';
  pageTitle.textContent = 'My Profile';
  pageTitle.id = 'profile-heading';

  container.appendChild(pageTitle);

  const profileInfoContainer = document.createElement('section');
  profileInfoContainer.className +=
    'flex flex-col relative overflow-hidden md:flex-row p-6 rounded-xl items-center justify-center gap-6 bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-2 mx-auto shadow-[0_0_30px_rgba(255,230,0,0.4)] border-yellow-300/40';
  profileInfoContainer.setAttribute('aria-labelledby', 'profile-info-heading');

  const profileInfoHeading = document.createElement('h2');
  profileInfoHeading.id = 'profile-info-heading';
  profileInfoHeading.className = 'sr-only';
  profileInfoHeading.textContent = 'Profile Information';

  profileInfoContainer.appendChild(profileInfoHeading);

  const pattern = document.createElement('div');
  pattern.className =
    'absolute inset-0 opacity-10 bg-[radial-gradient(circle,_#B56A00_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_#fff_1px,_transparent_1px)] bg-[size:20px_20px] pointer-events-none';

  profileInfoContainer.appendChild(pattern);

  const fallback = `${import.meta.env.BASE_URL}images/lemonmascot-1.png`;

  const avatarWrapper = document.createElement('div');
  avatarWrapper.className = 'relative';

  const profileImage = document.createElement('img');
  profileImage.src = user?.avatar?.url || fallback;
  profileImage.alt = 'Profile Picture';
  profileImage.className =
    'w-32 h-32 rounded-full object-cover border-2 border-primary';

  const editAvatarBtn = document.createElement('button');
  editAvatarBtn.className =
    'absolute bottom-0 right-0 bg-primary text-text dark:text-card p-2 rounded-full opacity-80 hover:opacity-100 transition-opacity';
  editAvatarBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  editAvatarBtn.setAttribute('aria-label', 'Edit Profile Avatar');

  editAvatarBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = user?.avatar?.url || '';
    input.placeholder = 'Enter avatar image URL';
    input.className = 'input w-full mt-2';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'btn-primary mt-2';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'btn-secondary mt-2 ml-2';

    avatarWrapper.innerHTML = '';

    avatarWrapper.appendChild(profileImage);
    avatarWrapper.appendChild(input);
    avatarWrapper.appendChild(saveBtn);
    avatarWrapper.appendChild(cancelBtn);

    saveBtn.addEventListener('click', async () => {
      try {
        const result = await updateProfile({
          avatar: {
            url: input.value,
          },
        });

        localStorage.setItem(
          'authUser',
          JSON.stringify({
            ...user,
            avatar: result.data.avatar,
          })
        );

        profileImage.src = result.data.avatar.url;

        avatarWrapper.innerHTML = '';
        avatarWrapper.appendChild(profileImage);
        avatarWrapper.appendChild(editAvatarBtn);

        showToast('Avatar updated successfully!', 'success');
      } catch (error) {
        showToast('Error updating avatar.', 'error');
      }
    });

    cancelBtn.addEventListener('click', () => {
      avatarWrapper.innerHTML = '';
      avatarWrapper.appendChild(profileImage);
      avatarWrapper.appendChild(editAvatarBtn);
    });
  });

  const profileInfo = document.createElement('section');
  profileInfo.className =
    'bg-[#f5f5f5] border-2 border-text text-text dark:text-card rounded-lg p-4 max-w-md w-full';
  profileInfo.innerHTML = `
      <h2 class="text-2xl font-poppins font-semibold mb-2">Your Information</h2>
      <p><strong>Name:</strong> ${user?.name || 'Unknown'}</p>
      <p><strong>Email:</strong> ${user?.email || 'Unknown'}</p>
      <p><strong>Address:</strong> ${user?.address || 'Unknown'}</p>
      <p><strong>Phone:</strong> ${user?.phone || 'Unknown'}</p>
    `;

  const profileBio = document.createElement('div');
  profileBio.className =
    'relative bg-[#f5f5f5] border-2 border-text text-text dark:text-card rounded-lg p-4 max-w-md w-full';

  const bioText = document.createElement('p');
  bioText.textContent = user?.bio || 'No bio available.';

  const editBioBtn = document.createElement('button');
  editBioBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  editBioBtn.className =
    'absolute top-0 right-0 bg-primary text-text dark:text-card p-2 rounded-full opacity-80 hover:opacity-100 transition-opacity';
  editBioBtn.setAttribute('aria-label', 'Edit Profile Bio');

  editBioBtn.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    textarea.value = bioText.textContent;
    textarea.className = 'input w-full';
    textarea.setAttribute('aria-label', 'Edit your bio');

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'btn-primary mt-2';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'btn-secondary mt-2 ml-2';

    profileBio.innerHTML = '';
    profileBio.appendChild(textarea);
    profileBio.appendChild(saveBtn);
    profileBio.appendChild(cancelBtn);

    saveBtn.addEventListener('click', async () => {
      try {
        const result = await updateProfile({
          bio: textarea.value,
        });
        bioText.textContent = result.data.bio;
        localStorage.setItem(
          'authUser',
          JSON.stringify({ ...user, bio: result.data.bio })
        );
        profileBio.innerHTML = '';
        profileBio.appendChild(bioText);
        profileBio.appendChild(editBioBtn);
        showToast('Bio updated successfully!', 'success');
      } catch (error) {
        showToast('Error updating bio. Please try again later.', 'error');
      }
    });

    cancelBtn.addEventListener('click', () => {
      profileBio.innerHTML = '';
      profileBio.appendChild(bioText);
      profileBio.appendChild(editBioBtn);
    });
  });

  const hr = document.createElement('hr');
  hr.className = 'my-4 border-text';

  /**
   * Toggles active state between two buttons.
   *
   * @param {HTMLButtonElement} activeBtn - Button to activate
   * @param {HTMLButtonElement} inactiveBtn - Button to deactivate
   *
   * @returns {void}
   */
  function setActiveButton(activeBtn, inactiveBtn) {
    activeBtn.setAttribute('aria-pressed', 'true');
    inactiveBtn.setAttribute('aria-pressed', 'false');
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
  });

  ownListingButton.addEventListener('click', async () => {
    const base = import.meta.env.BASE_URL || '';
    history.pushState({}, '', `${base}profile?tab=listings`);
    setActiveButton(ownListingButton, myBidsButton);
    if (!cachedListings) {
      cachedListings = await fetchOwnListings();
    }
    renderListings(cachedListings, OwnListingCard);
  });

  /**
   * Renders a list of listings into the profile section.
   *
   * Applies fade-out/fade-in animation during updates.
   *
   * @param {Array<Object>} listings - Array of listing objects
   * @param {Function} cardComponent - Function that returns a DOM card element
   *
   * @returns {void}
   */
  function renderListings(listings, cardComponent) {
    // fade out
    ownListingSection.classList.add('opacity-0');

    setTimeout(() => {
      ownListingSection.innerHTML = '';

      if (listings.length === 0) {
        ownListingSection.textContent =
          '<p role="status">No listings found.</p>';
      } else {
        listings.forEach((listing) => {
          if (!listing || !listing.title) {
            console.warn('Skipping invalid listing:', listing);
            return;
          }
          ownListingSection.appendChild(cardComponent(listing));
        });
      }

      // fade in
      ownListingSection.classList.remove('opacity-0');
    }, 150);

    document.addEventListener('listingDeleted', (e) => {
      const deletedId = e.detail;
      const card = document.querySelector(`[data-listing-id="${deletedId}"]`);
      if (card) {
        card.remove();
        showToast('Listing removed from your profile.', 'success');
      }
    });
  }

  const ownListingSection = document.createElement('section');
  ownListingSection.className =
    'mt-6 md:w-2/3 grid grid-cols-1 auto-rows h-full mx-auto md:grid-cols-1 gap-4 transition-opacity duration-300';

  container.appendChild(profileInfoContainer);
  avatarWrapper.appendChild(profileImage);
  avatarWrapper.appendChild(editAvatarBtn);
  profileBio.appendChild(bioText);
  profileBio.appendChild(editBioBtn);
  profileInfoContainer.appendChild(avatarWrapper);
  profileInfoContainer.appendChild(profileInfo);
  profileInfoContainer.appendChild(profileBio);
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
      '<p role="alert">Error loading data. Please try again later.</p>';
  }

  /**
   * Handles "bid:placed" event.
   *
   * Refreshes bids only if the current tab is "bids".
   *
   * @returns {void}
   */
  function handleBidPlaced() {
    const params = new URLSearchParams(window.location.search);
    const currentTab = params.get('tab');
    if (currentTab !== 'bids') return;
    refreshMyBids();
  }

  /**
   * Fetches and re-renders the user's bid listings.
   *
   * Updates cached bids and UI.
   *
   * @async
   * @returns {Promise<void>}
   */
  async function refreshMyBids() {
    try {
      cachedBids = await fetchMyBidsListings();
      renderListings(cachedBids, myBidsCard);
    } catch (error) {
      showToast('Error refreshing bids. Please try again later.', 'error');
    }
  }
  document.addEventListener('bid:placed', handleBidPlaced);

  return container;
}
