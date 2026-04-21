export default function ListingCard(listing) {
      
    const card = document.createElement('div');
    card.className = "card card-hover border-2 border-border rounded-lg w-full flex flex-col cursor-pointer ";

    card.addEventListener('click', () => {
        openListingModal(listing);
    });

    const header = document.createElement('div');
    header.className = "bg-header w-full h-12 flex items-center rounded-t-md justify-center";

    const image = document.createElement('img');
    image.className = "card-image";
   
    const imageURL = listing.media?.[0]?.url || "/images/Lemonmascot.png";
    image.className = "rounded-b-md w-full h-48 object-cover";
    image.src = imageURL || "/images/Lemonmascot.png";
    image.alt = listing.title || "Listing Image";

    const cardBody = document.createElement('div');
    cardBody.className = "card-body";

    const cardTitle = document.createElement('h2');
    cardTitle.className = "card-title truncate p-2";
    cardTitle.textContent = listing.title;

    const cardDescription = document.createElement('p');
    cardDescription.className = "card-text";
    cardDescription.textContent = listing.description || 'No description available.' ;

    const fullText = listing.description || 'No description available.';
    const maxLength = 50;
    cardDescription.textContent = truncateText(fullText, maxLength);
 
    const highestBid = getHighestBid(listing.bids);
    
    const bid = document.createElement('span');
    bid.className = "card-text font-bold";
    bid.textContent = `Highest Bid: ${highestBid} credits`;

    const timeRemaining = document.createElement('span');
    timeRemaining.className = "card-time";
    const endTime = new Date(listing.endsAt);

function updateCountdown() {
    const now = new Date();
    const timeDiff = endTime - now;

    if (timeDiff <= 0) {
        timeRemaining.className = "card-time-ended";
        timeRemaining.textContent = "Auction Ended";
        clearInterval(interval); 
        return;
    }

    let remaining = timeDiff;

    const weeks = Math.floor(remaining / (1000 * 60 * 60 * 24 * 7));
    remaining %= (1000 * 60 * 60 * 24 * 7);

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    remaining %= (1000 * 60 * 60 * 24);

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    remaining %= (1000 * 60 * 60);

    const minutes = Math.floor(remaining / (1000 * 60));
    remaining %= (1000 * 60);

    const seconds = Math.floor(remaining / 1000);

    timeRemaining.textContent =
        `Ends in: ${weeks}w ${days}d ${hours}h ${minutes}m ${seconds}s`;
}
const interval = setInterval(updateCountdown, 1000);
updateCountdown();


    const bidButton = document.createElement('button');
    bidButton.className = "btn-sm mb-2 ";
    bidButton.textContent = "Place a Bid";
    bidButton.addEventListener('click', () => {
        alert(`You clicked on ${listing.title}`);
    });


    cardBody.appendChild(timeRemaining);
    header.appendChild(cardTitle);
    cardBody.appendChild(cardDescription);
    cardBody.appendChild(bid);
    cardBody.appendChild(bidButton);
    card.appendChild(header);
    card.appendChild(image);
    card.appendChild(cardBody);

    return card;
}


function getHighestBid(bids = []) {
    if (!bids.length) return 0;
    return Math.max(...bids.map((bid) => bid.amount));
}

function truncateText(text, maxLength) {
    if( text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}
