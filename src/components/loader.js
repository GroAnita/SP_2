export default function Loader(size = 'md') {
  const loaderWrapper = document.createElement('div');
  loaderWrapper.className =
    'flex justify-center items-center py-10 col-span-full';

  const loader = document.createElement('div');

  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  loader.className = `loader ${sizes[size] || sizes.md}`;

  loaderWrapper.appendChild(loader);
  return loaderWrapper;
}
