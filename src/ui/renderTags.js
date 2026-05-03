export default function renderTags(tags, tagsWrapper, tagsInput) {
  tagsWrapper.innerHTML = '';
  tags.forEach((tag, index) => {
    const chip = document.createElement('span');
    chip.className =
      'bg-primary text-text px-2 py-1 rounded-xl text-sm flex items-center gap-1';
    chip.textContent = tag;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'x';
    removeBtn.className = 'ml-1';

    removeBtn.addEventListener('click', () => {
      tags.splice(index, 1);
      renderTags(tags, tagsWrapper, tagsInput);
    });

    chip.appendChild(removeBtn);
    tagsWrapper.appendChild(chip);
  });
  tagsWrapper.appendChild(tagsInput);
}
