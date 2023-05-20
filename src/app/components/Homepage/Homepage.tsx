'use client';

// this is a client component 👈🏽
import MetaMaskLinks from '@/app/components/metamaskLinks';
import { EventInterface } from '@/app/typings/event.interface';
import Link from 'next/link';
import React, { ReactElement } from 'react';

interface HomeInterface {
  events: EventInterface[];
}

export default function Homepage({ events }: HomeInterface): ReactElement {
  return (
    <>
      <MetaMaskLinks />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {events.map(({ id, description, name }: EventInterface, idx) => (
          <Link href={`/app/event/${id}`} key={`${id}_${idx}`}>
            <button key={id}>
              <h1>{name}</h1>
              <h4>{description}</h4>
            </button>
          </Link>
        ))}
      </div>
    </>
  );
}
