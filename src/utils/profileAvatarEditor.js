import { updateProfile } from '../services/profileUpdateService.js';
import showToast from '../ui/showToast.js';

export default function profileAvatarEditor({
  avatarWrapper,
  profileImage,
  editAvatarBtn,
  user,
}) {
  editAvatarBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = user?.avatar?.url || '';
    input.placeholder = 'Enter new avatar URL';
    input.className = 'input w-full mt-2';
    input.setAttribute('aria-label', 'Edit your profile avatar URL');

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'btn-primary mt-2';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'btn-secondary mt-2 ml-2';

    avatarWrapper.innerHTML = '';

    avatarWrapper.append(profileImage, input, saveBtn, cancelBtn);

    saveBtn.addEventListener('click', async () => {
      try {
        const result = await updateProfile({ avatar: { url: input.value } });

        localStorage.setItem(
          'authUser'.JSON.stringify({ ...user, avatar: result.data.avatar })
        );

        profileImage.src = result.data.avatar.url;
        avatarWrapper.innerHTML = '';
        avatarWrapper.append(profileImage, editAvatarBtn);
        showToast('Profile avatar updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating profile avatar:', error);
        showToast(
          'Failed to update profile avatar. Please try again.',
          'error'
        );
      }
    });

    cancelBtn.addEventListener('click', () => {
      avatarWrapper.innerHTML = '';
      avatarWrapper.append(profileImage, editAvatarBtn);
    });
  });
}
