/**
 * Creates a breadcrumb navigation element for SPA routing.
 *
 * Each breadcrumb item can optionally include a path:
 * - Items with a `path` (except the last one) are rendered as clickable links
 * - The last item is rendered as plain text (current page)
 *
 * Designed to work with SPA navigation using `[data-link]` attributes.
 *
 * @function Breadcrumbs
 * @param {Array<Object>} items - Array of breadcrumb items
 * @param {string} items[].label - The text displayed for the breadcrumb
 * @param {string} [items[].path] - Optional path for navigation (used for links)
 *
 * @returns {HTMLElement} A <nav> element containing the breadcrumb list
 *
 * @example
 * const breadcrumbs = Breadcrumbs([
 *   { label: 'Home', path: '/' },
 *   { label: 'Listings', path: '/listings' },
 *   { label: 'Sunglasses' }
 * ]);
 *
 * container.appendChild(breadcrumbs);
 */

export default function Breadcrumbs(items = []) {
  const base = import.meta.env.BASE_URL || '';
  const nav = document.createElement('nav');
  nav.className = 'text-sm text-gray-400 mb-4';
  nav.setAttribute('aria-label', 'Breadcrumb');

  const list = document.createElement('ol');
  list.className = 'flex gap-2 flex-wrap items-center';

  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-2';

    if (item.path && index !== items.length - 1) {
      const link = document.createElement('a');
      link.href = `${base}${item.path}`;
      link.textContent = item.label;
      link.className = 'hover:underline text-gray-500';
      link.setAttribute('data-link', '');
      li.appendChild(link);
    } else {
      const span = document.createElement('span');
      span.textContent = item.label;
      span.className = 'font-semibold text-gray-400';
      li.appendChild(span);
    }

    if (index < items.length - 1) {
      const seperator = document.createElement('span');
      seperator.textContent = '/';
      seperator.className = 'text-gray-400';
      li.appendChild(seperator);
    }

    list.appendChild(li);
  });

  nav.appendChild(list);
  return nav;
}
