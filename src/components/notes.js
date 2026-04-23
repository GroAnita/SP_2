function updateCountdown() {
  const now = new Date();
  const timeDiff = endTime - now;

  if (timeDiff <= 0) {
    timeRemaining.textContent = 'Auction Ended';
    timeRemaining.classList.remove('card-time');
    timeRemaining.classList.add('card-time-ended');
    clearInterval(interval);
    return;
  }

  let remaining = timeDiff;

  const weeks = Math.floor(remaining / (1000 * 60 * 60 * 24 * 7));
  remaining %= 1000 * 60 * 60 * 24 * 7;

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  remaining %= 1000 * 60 * 60 * 24;

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  remaining %= 1000 * 60 * 60;

  const minutes = Math.floor(remaining / (1000 * 60));

  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  timeRemaining.textContent = `Ends: ${weeks}w${days}d ${hours}h ${minutes}m ${seconds}s`;
}

const interval = setInterval(updateCountdown, 1000);
updateCountdown();
