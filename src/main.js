import './styles/input.css'
import router from './router/router.js';
const prefersDarkMode = window.matchMedia("(prefers-Dark-Mode: Dark)").matches;
if (prefersDarkMode) {
  document.dodumentElement.classList.add('dark');
}else {
  document.documentElement.classList.remove('dark');
}

window.addEventListener('DOMContetLoaded', router);
window.addEventListener('popstate', router);

router();