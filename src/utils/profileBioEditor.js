import { updateProfile } from '../services/profileUpdateService.js';
import showToast from '../ui/showToast.js';

export default function profileBioEditor({
  profileBio,
  bioText,
  editBioBtn,
  user,
}) {
  editBioBtn.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    textarea.value = bioText.textContent;
    textarea.className = 'input w-full';
    textarea.setAttribute('aria-label', 'Edit your profile bio');

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'btn-primary mt-2';
    saveBtn.type = 'button';
    saveBtn.setAttribute('aria-label', 'Save your profile bio');

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'btn-secondary mt-2 ml-2';
    cancelBtn.type = 'button';
    cancelBtn.setAttribute('aria-label', 'Cancel editing your profile bio');

    profileBio.innerHTML = '';
    profileBio.append(textarea, saveBtn, cancelBtn);

    saveBtn.addEventListener('click', async () => {
      try {
        const result = await updateProfile({ bio: textarea.value });

        biotext.textContent = result.data.bio;
        localStorage.setItem(
          'authUser',
          JSON.stringify({ ...user, bio: result.data.bio })
        );

        profileBio.innerHTML = '';
        profileBio.append(bioText, editBioBtn);
        showToast('Profile bio updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating profile bio:', error);
        showToast('Failed to update profile bio. Please try again.', 'error');
      }
    });

    cancelBtn.addEventListener('click', () => {
      profileBio.innerHTML = '';
      profileBio.append(bioText, editBioBtn);
    });
  });
}
