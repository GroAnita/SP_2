export function updateCountdown(timeEl, endTime) {
  let interval;
  function tick() {
    if (!(timeEl instanceof Element) || Number.isNaN(endTime?.getTime?.())) {
      return;
    }

    const now = new Date();
    const timeDiff = endTime - now;
    // some fun styling based on time left
    timeEl.classList.remove(
      'text-green-400',
      'text-yellow-400',
      'text-red-500',
      'animate-pulse',
      'shadow-[0_0_10px_2px_rgba(255,0,0,0.7)]'
    );

    if (timeDiff <= 60000) {
      timeEl.classList.add(
        'text-red-500',
        'animate-pulse',
        'shadow-[0_0_10px_2px_rgba(255,0,0,0.7)]'
      );
      if (timeDiff <= 10000) {
        timeEl.classList.add('scale-110');
      }
    } else if (timeDiff <= 3600000) {
      timeEl.classList.add('text-yellow-400');
    } else {
      timeEl.classList.add('text-green-400');
    }

    if (timeDiff <= 0) {
      timeEl.textContent = 'Auction Ended';
      timeEl.classList.remove('card-time');
      timeEl.classList.add('card-time-ended');
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

    if (weeks > 0) {
      timeEl.textContent = `⏳ ${weeks}w ${days}d`;
    } else if (days > 0) {
      timeEl.textContent = `⏳ ${days}d ${hours}h`;
    } else if (hours > 0) {
      timeEl.textContent = `⏳ ${hours}h ${minutes}m`;
    } else {
      timeEl.textContent = `⏳ ${minutes}m ${seconds}s`;
    }
  }

  tick();

  interval = setInterval(tick, 1000);

  return interval;
}
