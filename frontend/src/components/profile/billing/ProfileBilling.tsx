import { useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import type { PaymentMethod, CardFormData } from '../../../types/billings';
import { FormTitle } from '../../layout/SettingsForm';
import BillingCard from './BillingCard';

const ProfileBilling = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const generateId = () => `pm-${Date.now()}`;
  
  // Detect card type based on number
  const detectCardType = (cardNumber: string): PaymentMethod['cardType'] => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    return 'visa'; // Default to Visa
  };

  // Handle saving card information
  const handleSaveCard = async (data: CardFormData) => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (paymentMethod) {
        // Update existing payment method
        const updatedMethod: PaymentMethod = {
          ...paymentMethod,
          holderName: data.holderName,
          expMonth: parseInt(data.expMonth),
          expYear: parseInt(data.expYear),
          updatedAt: new Date().toISOString()
        };
        setPaymentMethod(updatedMethod);
        setSuccessMessage('Payment method updated successfully!');
      } else {
        // Create new payment method
        const newMethod: PaymentMethod = {
          id: generateId(),
          last4: data.cardNumber.slice(-4),
          cardType: detectCardType(data.cardNumber),
          holderName: data.holderName,
          expMonth: parseInt(data.expMonth),
          expYear: parseInt(data.expYear),
          createdAt: new Date().toISOString()
        };
        setPaymentMethod(newMethod);
        setSuccessMessage('Payment method added successfully!');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error saving payment method:', error);
      setSuccessMessage('Failed to save payment method. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCard = () => {
    const confirmed = window.confirm('Are you sure you want to remove this payment method?');
    if (confirmed) {
      setPaymentMethod(null);
      setSuccessMessage('Payment method removed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="container p-6 md:p-8">
      <FormTitle title="Billing & Payments" icon={<FiCreditCard />} />
      
      {/* Test Environment Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="text-yellow-600 text-sm">
            🧪 <strong>Test Environment:</strong> This is a demo. No real payments will be processed.
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-green-600 text-sm">
              ✅ {successMessage}
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Section */}
      <div className="space-y-6">
        <BillingCard
          paymentMethod={paymentMethod}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
          isLoading={isUpdating}
        />
      </div>
    </div>
  );
};

export default ProfileBilling;