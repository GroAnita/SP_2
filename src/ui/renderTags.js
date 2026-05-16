/**
 * Renders a list of tag chips inside a wrapper element.
 *
 * Features:
 * - Displays tags as removable chips
 * - Allows tags to be deleted dynamically
 * - Re-renders the tag list after removal
 * - Keeps the input field appended at the end
 *
 * Each tag chip contains:
 * - Tag label text
 * - Remove button (`x`)
 *
 * @function renderTags
 *
 * @param {string[]} tags
 * Array of tag strings.
 *
 * @param {HTMLElement} tagsWrapper
 * Container element where tags are rendered.
 *
 * @param {HTMLInputElement} tagsInput
 * Input field used for adding new tags.
 *
 * @returns {void}
 *
 * @example
 * renderTags(tags, tagsWrapper, tagsInput);
 */
export default function renderTags(tags, tagsWrapper, tagsInput) {
  tagsWrapper.innerHTML = '';
  tags.forEach((tag, index) => {
    const chip = document.createElement('span');
    chip.className =
      'bg-primary text-gray-900 px-2 py-1 rounded-xl text-sm flex items-center gap-1';
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
