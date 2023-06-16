import EventName from '@/app/components/Event/EventName';
import { getEventBySlug } from '@/app/utils';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

const EventTokens = dynamic(() => import('@/app/components/Event/EventTokens'), { ssr: false });

export default async function MyEventTokens({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  const event = await getEventBySlug(slug, ['name', 'chainId', 'checkoutProjectId', 'amountOfTokensToGetReward'], true);

  return (
    <>
      <EventName name={event.name} />
      <EventTokens {...event} wrapperClassName={'my-2'} />
    </>
  );
}
