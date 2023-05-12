import WinterCheckout from '@usewinter/checkout/dist/components/WinterCheckout';
import React from 'react';

interface CheckoutPropsInterface {
  address: string;
  projectId: string;
  isBuyPanelOpen: boolean;
  setIsBuyPanelOpen: (isBuyPanelOpen: boolean) => void;
}

export default function Checkout({ address, projectId, isBuyPanelOpen, setIsBuyPanelOpen}: CheckoutPropsInterface) {
  if (!address) {
    return <></>;
  }
  return <WinterCheckout
    showModal={isBuyPanelOpen}
    onClose={() => setIsBuyPanelOpen(false)}
    projectId={projectId}
    extraMintParams={{ '_amount': 1 }}
    priceFunctionParams={{ '_amount': 1 }}
    walletAddress={address}
    orderSource={'opensea.io'}
    fillSource={'opensea.io'}
    production={false}
    language={'english'}
    appearance={{
      leftBackgroundColor: '#131317',
      rightBackgroundColor: '#22222d',
      buttonTextColor: 'black',
      buttonColor: '#f59e0c',
      primaryTextColor: 'white',
      secondaryTextColor: '#85868a',
      fontFamily: 'Montserrat,sans-serif',
      buttonAndInputBoxShadow: '0 3px 6px 1px rgba(217, 119, 6, 0.2)',
      buttonAndInputFocusBoxShadow: '0 3px 6px 1px rgba(217, 119, 6, 0.8)',
      quantityButtonPlusMinusSvgFilter: 'invert(100%) sepia(100%) saturate(1%) hue-rotate(135deg) brightness(105%) contrast(101%)',
      inputBackgroundColor: '#131317',
      mintingClipLoaderColor: 'white',
      borderColor: 'rgba(245,158,11)'
    }}
  />;
};
