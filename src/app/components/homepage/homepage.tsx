'use client';

// this is a client component 👈🏽
import MetaMaskLinks from '@/app/components/metamaskLinks';
import { EventInterface } from '@/app/typings/event.interface';
import { useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

interface HomeInterface {
  events: EventInterface[];
}

export default function Homepage({ events }: HomeInterface): ReactElement {
  const router = useRouter();

  return (
    <>
      <MetaMaskLinks />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {events.map((event: EventInterface) => (
          <button key={event.id} onClick={() => router.push(`/event/${event.id}`)}>
            <h1>{event.eventName}</h1>
            <h4>{event.eventDescription}</h4>
          </button>
        ))}
      </div>
    </>
  );
}
