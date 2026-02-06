'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { CheckoutForm, OrderSummary } from '../organisms';
import { CheckIcon } from '../atoms';
import { useCheckoutController } from '../../controllers/checkout-controller';
import { PRODUCT } from '../../data/product';

const pageStyles =
  'bg-gradient-to-b from-muted/50 to-background flex flex-col min-h-screen';
const headerStyles = 'border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10';
const headerContainerStyles = 'max-w-6xl mx-auto px-4 py-4';
const logoStyles = 'w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center';
const mainStyles =
  'w-full px-6 py-8 flex-1 lg:max-w-6xl lg:mx-auto lg:px-4';
const gridStyles =
  'grid gap-8 lg:grid-cols-[1fr,400px] lg:gap-12 flex-1 items-stretch';
const footerStyles = 'border-t border-border mt-auto';
const footerContainerStyles = 'max-w-6xl mx-auto px-4 py-6';

const successPageStyles = 'min-h-screen bg-gradient-to-b from-emerald-50 to-background flex items-center justify-center p-4'
const successContainerStyles = 'text-center space-y-4 animate-in fade-in zoom-in duration-500'
const successIconContainerStyles = 'w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center'

function SuccessView({ onReset }: { onReset: () => void }) {
  return (
    <div className={successPageStyles}>
      <div className={successContainerStyles}>
        <div className={successIconContainerStyles}>
          <CheckIcon className="text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Compra realizada com sucesso!</h1>
        <p className="text-muted-foreground">Voce recebera um e-mail com os detalhes da compra.</p>
        <Button onClick={onReset} className="mt-4">
          Fazer nova compra
        </Button>
      </div>
    </div>
  )
}

function HeaderLogo() {
  return (
    <Image
      src="https://tse4.mm.bing.net/th/id/OIP.jJUL84nu6YbnpZCdCungEwHaHa"
      alt="cakto logo"
      width={32}
      height={32}
    />
  );
}

export function CheckoutPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    form,
    paymentMethod,
    installments,
    fees,
    isSubmitting,
    pixComparison,
    actions,
  } = useCheckoutController(PRODUCT.currentPrice);


  if (isSuccess) {
    return <SuccessView onReset={() => setIsSuccess(false)} />;
  }

  return (
    <div className={pageStyles}>
      <header className={headerStyles}>
        <div className={headerContainerStyles}>
          <div className="flex items-center gap-2">
            <div className={logoStyles}>
              <HeaderLogo />
            </div>
            <span className="font-semibold">Checkout Cakto</span>
          </div>
        </div>
      </header>

      <main className={mainStyles}>
        <div className={gridStyles}>
          <div className="order-2 lg:order-1">
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <CheckoutForm
                  form={form}
                  isSubmitting={isSubmitting}
                  productPrice={PRODUCT.currentPrice}
                  pixSavings={pixComparison.savings}
                  onSubmit={() =>
                    actions.handleSubmit(PRODUCT, () => setIsSuccess(true))
                  }
                  onPaymentMethodChange={actions.setPaymentMethod}
                />
              </CardContent>
            </Card>

          </div>

          <div className="order-1 lg:order-2">
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Resumo do pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderSummary
                  product={PRODUCT}
                  fees={fees}
                  paymentMethod={paymentMethod}
                  installments={installments}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className={footerStyles}>
        <div className={footerContainerStyles}>
          <p className="text-sm text-muted-foreground text-center">
            Ambiente seguro. Seus dados estão protegidos por criptografia SSL.
          </p>
        </div>
      </footer>
    </div>
  );
}
