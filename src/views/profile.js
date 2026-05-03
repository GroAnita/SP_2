import OwnListingCard from '../components/ownListingCard.js';
import { fetchOwnListings } from '../services/fetchOwnListings.js';
import CreateNewListing from '../components/createNewListing.js';
import { getAuthState } from '../state/authState.js';

export default async function Profile() {
  const user = getAuthState();
  const container = document.createElement('div');
  container.className = 'w-full mx-auto p-4';

  const title = document.createElement('h1');
  title.className = 'text-3xl text-text text-center font-bold mb-4';
  title.textContent = 'My Profile';

  const profileInfoContainer = document.createElement('section');
  profileInfoContainer.className =
    'flex bg-secondary p-4 rounded items-center gap-6';

  const fallback = `${import.meta.env.BASE_URL}images/lemonmascot-1.png`;
  const profileImage = document.createElement('img');
  profileImage.src = user?.avatar?.url || fallback;
  profileImage.alt = 'Profile Picture';
  profileImage.className =
    'w-32 h-32 rounded-full object-cover border-2 border-primary';

  const profileInfo = document.createElement('section');
  profileInfo.className =
    'bg-primary border-2 border-text text-gray-900 rounded-lg p-4 max-w-md w-full';
  profileInfo.innerHTML = `
      <h2 class="text-2xl font-poppins font-semibold mb-2">User Information</h2>
      <p><strong>Name:</strong> ${user?.name || 'Unknown'}</p>
      <p><strong>Email:</strong> ${user?.email || 'Unknown'}</p>
      <p><strong>Address:</strong> ${user?.address || 'Unknown'}</p>
      <p><strong>Phone:</strong> ${user?.phone || 'Unknown'}</p>
    `;

  const hr = document.createElement('hr');
  hr.className = 'my-4 border-text';

  const newListing = document.createElement('button');
  newListing.className = 'btn-primary mx-auto bg-secondary mb-4';
  newListing.textContent = 'Create New Listing';

  newListing.addEventListener('click', () => {
    CreateNewListing();
  });

  const ownListingSection = document.createElement('section');
  ownListingSection.className =
    'mt-6 grid grid-cols-1 auto-rows h-full md:grid-cols-3 gap-4';

  container.appendChild(title);
  container.appendChild(profileInfoContainer);
  profileInfoContainer.appendChild(profileImage);
  profileInfoContainer.appendChild(profileInfo);
  container.appendChild(hr);
  container.appendChild(newListing);
  container.appendChild(ownListingSection);

  try {
    const listings = await fetchOwnListings();
    listings.forEach((listing) => {
      ownListingSection.appendChild(OwnListingCard(listing));
    });
  } catch (error) {
    ownListingSection.textContent =
      'Error loading your listings. Please try again later.';
  }
  return container;
}
