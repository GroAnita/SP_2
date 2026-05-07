import OwnListingCard from '../components/ownListingCard.js';
import { fetchOwnListings } from '../services/fetchOwnListings.js';
import CreateNewListing from '../components/createNewListing.js';
import { getAuthState } from '../state/authState.js';
import { fetchMyBidsListings } from '../services/fetchMyBidsListings.js';
import myBidsCard from '../components/myBidsCard.js';
import { updateProfile } from '../services/profileUpdateService.js';
import showToast from '../ui/showToast.js';

export default async function Profile() {
  const user = getAuthState();
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  let cachedListings = null;
  let cachedBids = null;

  const container = document.createElement('div');
  container.className = 'w-full mx-auto p-4';

  const profileInfoContainer = document.createElement('section');
  profileInfoContainer.className +=
    'flex flex-col relative overflow-hidden md:flex-row p-6 rounded-xl items-center justify-center gap-6 bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-2 mx-auto shadow-[0_0_30px_rgba(255,230,0,0.4)] border-yellow-300/40';

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

  editAvatarBtn.addEventListener('click', () => {
    const newAvatarUrl = prompt('Enter new avatar URL:');
    if (!newAvatarUrl) return;
    updateProfile({
      avatar: {
        url: newAvatarUrl,
      },
    })
      .then((result) => {
        localStorage.setItem(
          'authUser',
          JSON.stringify({ ...user, avatar: result.data.avatar })
        );
        profileImage.src = newAvatarUrl;
        showToast('Avatar updated successfully!', 'success');
      })
      .catch(() => {
        showToast('Error updating avatar. Please try again later.', 'error');
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

  editBioBtn.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    textarea.value = bioText.textContent;
    textarea.className = 'input w-full';

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
      'Error loading data. Please try again later.';
  }
  return container;
}
