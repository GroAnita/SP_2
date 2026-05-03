let toastTimeout;

export default function showToast(message, type = 'error', duration = 3000) {
  let toast = document.getElementById('toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className =
      'fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white text-sm z-50 opacity-0 transition-opacity duration-300';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove('bg-green-500', 'bg-red-500', 'bg-yellow-500');
  toast.classList.add(
    type === 'success'
      ? 'bg-green-500'
      : type === 'warning'
        ? 'bg-yellow-500'
        : 'bg-red-500'
  );
  toast.style.opacity = '1';

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
  }, duration);
}
