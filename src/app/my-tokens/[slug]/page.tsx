import EventName from '@/app/components/Event/EventName';
import { getEventBySlug } from '@/app/utils';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

const EventTokens = dynamic(() => import('@/app/components/Event/EventTokens'), { ssr: false });
const AcquireToken = dynamic(() => import('@/app/components/AcquireToken/AcquireToken'), { ssr: false });

export default async function MyEventTokens({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  const event = await getEventBySlug(
    slug,
    ['name', 'chainId', 'winterProjectId', 'amountOfTokensToGetReward'],
    true
  );
  const { id, chainId, winterProjectId, collectionImage, amountOfTokensToGetReward } = event;

  return (
    <>
      <EventName name={event.name} />
      <EventTokens {...event} />
      <AcquireToken
        eventId={id}
        chainId={chainId as string}
        winterProjectId={winterProjectId}
        collectionImage={collectionImage}
        isPreviewImgShown={false}
        amountOfTokensToGetReward={amountOfTokensToGetReward}
      />
    </>
  );
}
