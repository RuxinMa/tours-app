/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

// 🎈 DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// 🎉 DELEGATION
if (mapBox) {
  // If the map element exists, parse the locations data and display the map
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations); // Call the function to display the map with locations
}

if (loginForm) {
  // If the login form exists, add an event listener for form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password); // Call the login function with email and password
  });
}

if (logoutBtn) {
  // If the logout button exists, add an event listener for click events
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default button behavior
    logout(); // Call the logout function to log the user out
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData(); // Create a new FormData object

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(form);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.textContent = 'Processing...'; // Change button text to indicate processing
    e.target.disabled = true; // Disable the button to prevent multiple clicks
    
    try {
      // const tourId = e.target.dataset.tourId;
      const { tourId } = e.target.dataset; // Use the dataset property to get the tour ID
      bookTour(tourId);
    } catch (err) {
      // console.error('Error booking tour:', err);
      e.target.textContent = 'Book tour now!'; // Restore button text on error
      e.target.disabled = false; // Re-enable the button
    }
  });
}