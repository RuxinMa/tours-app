/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 💳 Stripe Service for React
 * Handles Stripe integration for tour bookings
 */

import { bookingsService } from './bookingsService';

const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;

export class StripeError extends Error {
  public originalError?: any;

  constructor(message: string, originalError?: any) {
    super(message);
    this.name = 'StripeError';
    this.originalError = originalError;
  }
}

let stripeInstance: any = null;

const loadStripe = async (): Promise<any> => {
  if (stripeInstance) {
    return stripeInstance;
  }

  // Check if Stripe is already loaded in the window object
  if (typeof window !== 'undefined' && (window as any).Stripe) {
    stripeInstance = (window as any).Stripe(STRIPE_PUBLIC_KEY);
    return stripeInstance;
  }

  // Load Stripe script dynamically
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    
    script.onload = () => {
      if ((window as any).Stripe) {
        stripeInstance = (window as any).Stripe(STRIPE_PUBLIC_KEY);
        resolve(stripeInstance);
      } else {
        reject(new Error('Stripe failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Stripe script'));
    };
    
    document.head.appendChild(script);
  });
};

export const stripeService = {
  /**
   * Start the booking process for a tour
   */
  async bookTour(tourId: string): Promise<void> {
    try {
      console.log(`💳 StripeService: Starting booking process for tour ${tourId}...`);
      // 1. Load Stripe
      const stripe = await loadStripe();
      
      if (!stripe) {
        throw new StripeError('Failed to load Stripe');
      }

      // 2. Get checkout session
      console.log('💳 StripeService: Getting checkout session...');
      const { sessionId } = await bookingsService.getCheckoutSession(tourId);

      // 3. Redirect to Stripe checkout
      console.log('💳 StripeService: Redirecting to Stripe checkout...');
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      // If redirection fails, we reach here
      if (result.error) {
        throw new StripeError(result.error.message, result.error);
      }
      
    } catch (error) {
      console.error('🚨 StripeService: Booking failed:', error);
      
      if (error instanceof StripeError) {
        throw error;
      }
      
      throw new StripeError(
        'Failed to start booking process. Please try again.',
        error
      );
    }
  },

  /**
    * Check if the payment was successful
   */
  checkPaymentSuccess(): { isSuccess: boolean; tourId?: string; userId?: string; price?: string } {
    if (typeof window === 'undefined') {
      return { isSuccess: false };
    }

    const urlParams = new URLSearchParams(window.location.search);
    const tour = urlParams.get('tour');
    const user = urlParams.get('user');
    const price = urlParams.get('price');

    const isSuccess = !!(tour && user && price);

    return {
      isSuccess,
      tourId: tour || undefined,
      userId: user || undefined,
      price: price || undefined
    };
  },

  /**
   * Clear URL parameters (call after payment success handling)
   */
  clearPaymentParams(): void {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.search = ''; // Clear all query parameters

    // Use pushState to replace the current history entry without triggering a page refresh
    window.history.replaceState({}, '', url.toString());
  }
};