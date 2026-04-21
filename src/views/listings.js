import listingCard from '../components/listingCard.js';
import { fetchListings } from '../services/listingService.js';

export default async function Listings() {
    const container = document.createElement('div');
    container.className = "container mx-auto p-4 bg-bg ";

    const title = document.createElement('h1');
    title.className = "text-3xl font-bold mb-4";
    title.textContent = "Listings";
  const listingGrid = document.createElement('div');
    listingGrid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 justify-items-center";

    listingGrid.innerHTML = "<p>Loading...</p>";

    container.appendChild(title);
    container.appendChild(listingGrid);

    try {
        const result = await fetchListings();
        console.log("Fetched listings:", result);
        console.log("First listing:", result.data[0]);
        const listings = result.data;
        listingGrid.innerHTML = "";
        listings.forEach(listing => {
            const cardEl = listingCard(listing);
            listingGrid.appendChild(cardEl);
        });
    }catch (error) {
        listingGrid.innerHTML = "<p>Error loading listings. Please try again later.</p>";
    }

    return container;
}