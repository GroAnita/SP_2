export function imageFallback(imgEl, src, fallback) {
  imgEl.onerror = () => {
    imgEl.onerror = null; //prevent loop if fallback also fails
    imgEl.src = fallback;
  };

  imgEl.src = src || fallback;
}
