import { useFormContext } from 'react-hook-form';

import { FormField } from '../atoms';
import { InstallmentSelect } from '../molecules';
import { maskCardNumber, maskCardExpiry } from '../../domain/masks';
import { CheckoutFormData } from '../../types';
import { CardFormProps } from './types';


export function CardForm({ productPrice }: CardFormProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();

  const installments = watch('installments');

  return (
    <div className="space-y-4">
      <InstallmentSelect
        value={installments}
        productPrice={productPrice}
        onChange={(value) => setValue('installments', value)}
      />

      <FormField
        label="Número do cartão"
        error={errors?.card?.number?.message as string}
        {...register('card.number')}
        onChange={(e) => {
          const value = maskCardNumber(e.target.value);
          setValue('card.number', value, {
            shouldDirty: true,
          });
        }}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Validade"
          error={errors?.card?.expiry?.message as string}
          {...register('card.expiry')}
          onChange={(e) => {
            const value = maskCardExpiry(e.target.value);
            setValue('card.expiry', value, {
              shouldDirty: true,
            });
          }}
        />


        <FormField
          label="CVV"
          error={errors?.card?.cvv?.message as string}
          {...register('card.cvv')}
        />
      </div>

      <FormField
        label="Nome no cartão"
        error={errors?.card?.holderName?.message as string}
        {...register('card.holderName')}
      />
    </div>
  );
}
