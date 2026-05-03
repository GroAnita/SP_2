import RegisterUserForm from '../components/registerUserForm';

export default function Register() {
  const container = document.createElement('div');
  container.className = 'w-full mx-auto p-4';

  const form = RegisterUserForm();
  container.appendChild(form);
  return container;
}
