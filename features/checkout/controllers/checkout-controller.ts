'use client';

import { useState, useCallback, useMemo } from 'react';

import type {
  CheckoutFormData,
  PaymentMethod,
  FormErrors,
  Product,
} from '../types';

import { initialFormData } from './checkout.initial-state';
import { validateTouchedFields } from './checkout.validation';

import { maskCPF, maskCardNumber, maskCardExpiry } from '../domain/masks';
import { calculateFees } from '../domain/fee-calculator';
import { submitPayment } from '../services/checkout-service';
import { CheckoutController } from './controller.types';
import { isCheckoutFormValid } from './checkout.form-validity';
import { calculatePixComparison } from './checkout.pix-comparison';

export function useCheckoutController(
  productPrice: number,
): CheckoutController {
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(
    async (data: CheckoutFormData, touchedFields: Record<string, boolean>) => {
      const validationErrors = await validateTouchedFields(data, touchedFields);
      setErrors(validationErrors);
    },
    [],
  );

  const isFormValid = useMemo(
    () => isCheckoutFormValid(formData, errors),
    [formData, errors],
  );

  const fees = useMemo(
    () =>
      calculateFees(
        productPrice,
        formData.paymentMethod,
        formData.installments,
      ),
    [productPrice, formData.paymentMethod, formData.installments],
  );

  const pixComparison = useMemo(
    () => calculatePixComparison(productPrice, formData.installments),
    [productPrice, formData.installments],
  );

  const setEmail = useCallback(
    (value: string) => {
      const next = { ...formData, email: value };
      setFormData(next);
      validate(next, touched);
    },
    [formData, touched, validate],
  );

  const setCPF = useCallback(
    (value: string) => {
      const next = { ...formData, cpf: maskCPF(value) };
      setFormData(next);
      validate(next, touched);
    },
    [formData, touched, validate],
  );

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
      installments: method === 'pix' ? 1 : prev.installments,
    }));
  }, []);

  const setInstallments = useCallback((value: number) => {
    setFormData((prev) => ({ ...prev, installments: value }));
  }, []);

  const setCardNumber = useCallback(
    (value: string) => {
      const next = {
        ...formData,
        card: { ...formData.card!, number: maskCardNumber(value) },
      };
      setFormData(next);
      validate(next, touched);
    },
    [formData, touched, validate],
  );

  const setCardExpiry = useCallback(
    (value: string) => {
      const next = {
        ...formData,
        card: { ...formData.card!, expiry: maskCardExpiry(value) },
      };
      setFormData(next);
      validate(next, touched);
    },
    [formData, touched, validate],
  );

  const setCardCvv = useCallback(
    (value: string) => {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      const next = {
        ...formData,
        card: { ...formData.card!, cvv: digits },
      };
      setFormData(next);
      validate(next, touched);
    },
    [formData, touched, validate],
  );

  const setCardHolderName = useCallback(
    (value: string) => {
      const next = {
        ...formData,
        card: { ...formData.card!, holderName: value.toUpperCase() },
      };
      setFormData(next);
      validate(next, touched);
    },
    [formData, touched, validate],
  );

  const handleBlur = useCallback(
    (field: string) => {
      const nextTouched = { ...touched, [field]: true };
      setTouched(nextTouched);
      validate(formData, nextTouched);
    },
    [touched, formData, validate],
  );

  const handleSubmit = useCallback(
    async (product: Product, onSuccess: () => void) => {
      const allTouched = {
        email: true,
        cpf: true,
        cardNumber: true,
        cardExpiry: true,
        cardCvv: true,
        cardHolderName: true,
      };

      setTouched(allTouched);
      await validate(formData, allTouched);

      if (!isFormValid) return;

      setIsSubmitting(true);
      const result = await submitPayment(formData, product, fees);
      setIsSubmitting(false);

      if (result.success) {
        onSuccess();
      }
    },
    [formData, isFormValid, fees, validate],
  );

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    isFormValid,
    fees,
    pixComparison,
    actions: {
      setEmail,
      setCPF,
      setPaymentMethod,
      setInstallments,
      setCardNumber,
      setCardExpiry,
      setCardCvv,
      setCardHolderName,
      handleBlur,
      handleSubmit,
    },
  };
}
