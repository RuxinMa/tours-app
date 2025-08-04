/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async tourId => {
  try {
    const stripe = Stripe('pk_test_51RrYcPJrB7RpIx6XgIPLLq0VQ1PLRJddCQRHaeEBGRKQhrmQCR2SSFwwEdec64BZSJFHyGKIAumjCdGGYKXDkHFY00treFTE7T'); // Public Stripe key

    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    showAlert('error', err);
  }
  // 3) Restore button text and state
  const bookBtn = document.getElementById('book-tour');
    if (bookBtn) {
      bookBtn.textContent = 'Book tour now!';
      bookBtn.disabled = false;
    }
};
