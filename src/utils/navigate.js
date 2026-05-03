export default function navigate(path) {
  const base = import.meta.env.BASE_URL || '';

  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullPath = `${cleanBase}${cleanPath}`;

  window.history.pushState({}, '', fullPath);
  //trigger the router to handle the new URL
  window.dispatchEvent(new PopStateEvent('popstate'));
}
