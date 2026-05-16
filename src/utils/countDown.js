/**
 * Creates and updates a live countdown timer
 * for auction listings.
 *
 * Features:
 * - Updates every second
 * - Displays remaining time dynamically
 * - Applies visual urgency styling based on time left
 * - Stops automatically when the auction ends
 *
 * Time display format:
 * - Weeks + days
 * - Days + hours
 * - Hours + minutes
 * - Minutes + seconds
 *
 * Styling behavior:
 * - Green → More than 1 hour remaining
 * - Yellow → Less than 1 hour remaining
 * - Red + pulse animation → Less than 1 minute remaining
 * - Extra scaling → Less than 10 seconds remaining
 *
 * @function updateCountdown
 *
 * @param {HTMLElement} timeEl
 * Element where the countdown text is rendered.
 *
 * @param {Date} endTime
 * Auction end date/time.
 *
 * @returns {number}
 * Interval ID returned from `setInterval()`.
 *
 * @example
 * const intervalId = updateCountdown(timeElement, endDate);
 *
 * @example
 * clearInterval(intervalId);
 */
export function updateCountdown(timeEl, endTime) {
  let interval;
  /**
   * Updates countdown text and styling.
   *
   * @inner
   * @function tick
   *
   * @returns {void}
   */
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

    //urgency styling
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

    // If time is up, show ended state and stop timer
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
      timeEl.textContent = `Auction ends in: ${weeks}w ${days}d`;
    } else if (days > 0) {
      timeEl.textContent = `Auction ends in: ${days}d ${hours}h`;
    } else if (hours > 0) {
      timeEl.textContent = `Auction ends in: ${hours}h ${minutes}m`;
    } else {
      timeEl.textContent = `Auction ends in: ${minutes}m ${seconds}s`;
    }
  }

  tick();

  interval = setInterval(tick, 1000);

  return interval;
}
