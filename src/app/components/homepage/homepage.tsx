'use client'; // this is a client component 👈🏽

import React, { ReactElement } from 'react';

import { EventInterface } from '@/app/typings/event.interface';
import { useRouter } from 'next/navigation';
import { isMobileDevice } from '@/app/utils';
import { useMetaMask } from '@/app/hooks/useMetaMask';

interface HomeInterface {
  events: EventInterface[];
}

export default function Homepage({ events }: HomeInterface): ReactElement {
  const { hasProvider } = useMetaMask();
  const router = useRouter();

  const connectMetamaskMobile = (): void => {
    const dappUrl = window.location.href.split('//')[1].split('/')[0];
    const metamaskAppDeepLink = 'https://metamask.app.link/dapp/' + dappUrl;
    window.open(metamaskAppDeepLink, '_self');
  };

  const isMobile = isMobileDevice();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {isMobile && !hasProvider &&
        <>
          <p>MetaMask wallet is required to run this app</p>
          <a onClick={connectMetamaskMobile}><button>Open in MetaMask</button></a>
        </>
      }
      {!isMobile && !hasProvider &&
        <a href='https://metamask.io' target='_blank' rel='noreferrer'>
            <button>Install MetaMask</button>
        </a>
      }
      {events.map((event: EventInterface) =>
        <button key={event.id} onClick={() => router.push(`/event/${event.id}`)}>
          <h1>{event.eventName}</h1>
          <h4>{event.eventDescription}</h4>
        </button>
      )}
    </div>
  );
}
