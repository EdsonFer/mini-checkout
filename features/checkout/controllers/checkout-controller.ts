'use client';

import { useMemo, useState, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import type { CheckoutFormData, PaymentMethod, Product } from '../types';

import { initialFormData } from './checkout.initial-state';
import { calculateFees } from '../domain/fee-calculator';
import { calculatePixComparison } from './checkout.pix-comparison';
import { submitPayment } from '../services/checkout-service';
import type { CheckoutController } from './controller.types';
import { checkoutSchema } from '../domain/schemas';

export function useCheckoutController(
  productPrice: number,
): CheckoutController {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: initialFormData,
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    shouldUnregister: true,
  });

  const paymentMethod = useWatch({
    control: form.control,
    name: 'paymentMethod',
    defaultValue: 'pix',
  });

  const installments = useWatch({
    control: form.control,
    name: 'installments',
    defaultValue: 1,
  });

  const fees = useMemo(
    () => calculateFees(productPrice, paymentMethod, installments),
    [productPrice, paymentMethod, installments],
  );

  const pixComparison = useMemo(
    () => calculatePixComparison(productPrice, installments),
    [productPrice, installments],
  );

  const handlePaymentMethodChange = useCallback(
    (method: PaymentMethod) => {
      form.setValue('paymentMethod', method, { shouldDirty: true });

      if (method === 'card') {
        form.setValue('installments', 1, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    },
    [form],
  );

  const handleSubmit = useCallback(
    async (product: Product, onSuccess: () => void) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      setIsSubmitting(true);
      const data = form.getValues();
      const result = await submitPayment(data, product, fees);
      setIsSubmitting(false);

      if (result.success) {
        onSuccess();
        form.reset(initialFormData);
      }
    },
    [form, fees],
  );

  return {
    form,
    paymentMethod,
    installments,
    isSubmitting,
    fees,
    pixComparison,
    actions: {
      setPaymentMethod: handlePaymentMethodChange,
      handleSubmit,
    },
  };
}
