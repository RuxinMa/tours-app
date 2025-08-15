import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import type { PaymentMethod, CardFormData } from '../../../types/billings';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';

interface BillingCardProps {
  paymentMethod: PaymentMethod | null;
  onSave: (data: CardFormData) => void;
  onDelete: () => void;
  isLoading?: boolean;
}

const BillingCard = ({ 
  paymentMethod, 
  onSave, 
  onDelete, 
  isLoading 
}: BillingCardProps) => {
  const [formData, setFormData] = useState<CardFormData>({
    cardNumber: '',
    holderName: '',
    expMonth: '',
    expYear: '',
    cvc: ''
  });

  const [errors, setErrors] = useState<Partial<CardFormData>>({});

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        cardNumber: `**** **** **** ${paymentMethod.last4}`, // Mask last 4 digits
        holderName: paymentMethod.holderName,
        expMonth: paymentMethod.expMonth.toString().padStart(2, '0'),
        expYear: paymentMethod.expYear.toString(),
        cvc: '' // Mask CVC for security
      });
    } else {
      // Reset form if no payment method
      setFormData({
        cardNumber: '',
        holderName: '',
        expMonth: '',
        expYear: '',
        cvc: ''
      });
    }
  }, [paymentMethod]);

  const handleInputChange = (field: keyof CardFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for the field being edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CardFormData> = {};

    if (!formData.holderName.trim()) {
      newErrors.holderName = 'Cardholder name is required';
    }

    if (!formData.expMonth || parseInt(formData.expMonth) < 1 || parseInt(formData.expMonth) > 12) {
      newErrors.expMonth = 'Valid month is required';
    }

    if (!formData.expYear || parseInt(formData.expYear) < new Date().getFullYear()) {
      newErrors.expYear = 'Valid year is required';
    }

    // Only validate when adding or updating card number
    if (!paymentMethod || !formData.cardNumber.includes('****')) {
      if (!formData.cardNumber || formData.cardNumber.length < 13) {
        newErrors.cardNumber = 'Valid card number is required';
      }
    }

    if (!formData.cvc || formData.cvc.length < 3) {
      newErrors.cvc = 'Valid CVC is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const isEditing = !!paymentMethod;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="space-y-4">
        {/* Card Number */}
        <FormInput
          label="Card Number"
          type="text"
          value={formData.cardNumber}
          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
          placeholder="1234 5678 1234 5678"
          error={errors.cardNumber}
        />

        {/* Cardholder Name */}
        <FormInput
          label="Cardholder Name"
          type="text"
          value={formData.holderName}
          onChange={(e) => handleInputChange('holderName', e.target.value)}
          placeholder="Full Name"
          error={errors.holderName}
        />

        {/* Expiry Date */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Expiry Month"
            type="text"
            value={formData.expMonth}
            onChange={(e) => handleInputChange('expMonth', e.target.value)}
            placeholder="MM"
            error={errors.expMonth}
          />
          <FormInput
            label="Expiry Year"
            type="text"
            value={formData.expYear}
            onChange={(e) => handleInputChange('expYear', e.target.value)}
            placeholder="YYYY"
            error={errors.expYear}
          />
        </div>

        {/* CVC */}
        <FormInput
          label="CVC"
          type="text"
          value={formData.cvc}
          onChange={(e) => handleInputChange('cvc', e.target.value)}
          placeholder="123"
          error={errors.cvc}
        />

        {/* Action Buttons */}
        <div className="flex md:flex-row flex-col md:justify-between md:items-center items-center md:gap-12 justify-center gap-4 pt-4">
          {isEditing && (
            <Button
              variant="delete"
              onClick={onDelete}
              fullWidth={true}
            >
              <FiTrash2 size={14} className="mr-1" />
              Remove
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading}
            fullWidth={true}
          >
            {isLoading 
              ? 'Saving...' 
              : (isEditing ? 'Update Payment Method' : 'Add Payment Method')
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillingCard;