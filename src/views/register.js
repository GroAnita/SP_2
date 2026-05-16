import RegisterUserForm from '../components/registerUserForm';

/**
 * Creates the register page view.
 *
 * Renders the `RegisterUserForm` component
 * inside a responsive page container.
 *
 * Used as a route/view in the SPA router.
 *
 * @function Register
 *
 * @returns {HTMLDivElement}
 * Fully constructed register page container.
 *
 * @example
 * const view = Register();
 * app.appendChild(view);
 */
export default function Register() {
  const container = document.createElement('div');
  container.className = 'w-full mx-auto p-4';

  const form = RegisterUserForm();
  container.appendChild(form);
  return container;
}
