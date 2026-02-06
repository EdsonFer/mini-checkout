import { FormProvider, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { PaymentMethodSelector } from './payment-method-selector';
import type { CheckoutFormProps } from './types';
import { FormField } from '../atoms';
import { maskCPF } from '../../domain/masks';
import { Skeleton } from '@/components/ui/skeleton';

const CardFormLazy = dynamic(
  () =>
    import('./card-form').then((module) => module.CardForm),
  {
    ssr: false,
    loading: () => <CardFormSkeleton />,
  }
);

const submitButtonStyles = {
  base: 'w-full h-12 font-semibold',
  pix: 'bg-emerald-500 hover:bg-emerald-600',
  card: 'bg-primary',
};

export function CardFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Parcelas</label>
        <Skeleton className="h-11 w-full bg-gray-200" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Número do cartão</label>
        <Skeleton className="h-11 w-full bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Validade</label>
          <Skeleton className="h-11 w-full bg-gray-200" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">CVV</label>
          <Skeleton className="h-11 w-full bg-gray-200" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Nome no cartão</label>
        <Skeleton className="h-11 w-full bg-gray-200" />
      </div>
    </div>
  );
}

export function CheckoutForm({
  form,
  isSubmitting,
  productPrice,
  pixSavings,
  onSubmit,
  onPaymentMethodChange,
}: CheckoutFormProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  const paymentMethod = form.watch('paymentMethod');

  const handleSubmit: React.ComponentProps<'form'>['onSubmit'] = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full">
        <h2 className="text-xl font-semibold">Informações de pagamento</h2>

        <FormField
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormField
          label="CPF"
          placeholder="000.000.000-00"
          inputMode="numeric"
          maxLength={14}
          error={errors.cpf?.message}
          {...register('cpf')}
          onChange={(e) => {
            const value = maskCPF(e.target.value);
            setValue('cpf', value, {
              shouldDirty: true,
            });
          }}
        />


        <Controller
          control={form.control}
          name="paymentMethod"
          defaultValue="pix"
          render={({ field }) => (
            <PaymentMethodSelector
              value={field.value}
              onChange={(method) => {
                field.onChange(method);

                if (method === 'card') {
                  import('./card-form');
                }

                onPaymentMethodChange(method);
              }}
              pixSavings={pixSavings}
            />
          )}
        />

        {paymentMethod === 'card' && (
          <CardFormLazy productPrice={productPrice} />
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            submitButtonStyles.base,
            paymentMethod === 'pix'
              ? submitButtonStyles.pix
              : submitButtonStyles.card
          )}
        >
          {isSubmitting ? 'Processando...' : 'Finalizar compra'}
        </Button>
      </form>
    </FormProvider>
  );
}
