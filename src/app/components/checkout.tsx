import WinterCheckout from '@usewinter/checkout/dist/components/WinterCheckout';
import React from 'react';

interface CheckoutPropsInterface {
  address: string;
  projectId: string;
  isBuyPanelOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  mintQuantity: number;
}

export default function Checkout({
  address,
  projectId,
  isBuyPanelOpen,
  onSuccess,
  onClose,
  mintQuantity
}: CheckoutPropsInterface) {
  if (!address) {
    return <></>;
  }

  return (
    <WinterCheckout
      showModal={isBuyPanelOpen}
      onClose={onClose}
      projectId={projectId}
      priceFunctionParams={{ _amount: 1 }}
      walletAddress={address}
      orderSource={'opensea.io'}
      fillSource={'opensea.io'}
      production={process.env.NEXT_PUBLIC_ENV === 'production'}
      language={'english'}
      onSuccess={onSuccess}
      mintQuantity={mintQuantity}
      appearance={{
        zIndex: 100,
        leftBackgroundColor: '#4c1d95',
        rightBackgroundColor: '#8b5cf6',
        buttonTextColor: 'white',
        buttonColor: '#ec4899',
        primaryTextColor: 'white',
        secondaryTextColor: '#e8d5de',
        fontFamily: 'Montserrat,sans-serif',
        buttonAndInputBoxShadow: '0 3px 6px 1px #ec4899',
        buttonAndInputFocusBoxShadow: '0 3px 6px 1px #ec4899',
        inputBackgroundColor: '#ec4899',
        mintingClipLoaderColor: 'white',
        borderColor: '#ec4899'
      }}
    />
  );
}
