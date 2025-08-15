// Saved Card Info for displaying
export interface PaymentMethod {
  id: string;
  last4: string;           // "1234"
  cardType: 'visa' | 'mastercard' | 'amex' ;
  holderName: string;
  expMonth: number;        // 1-12
  expYear: number;         // 2024, 2025...
  createdAt: string;
  updatedAt?: string;      // Optional, if not updated
}

// Card Form Data for creating/updating card info
export interface CardFormData {
  cardNumber: string;
  holderName: string;
  expMonth: string;
  expYear: string;
  cvc: string;
}