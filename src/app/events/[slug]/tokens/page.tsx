import EventName from '@/app/components/Event/EventName';
import { getEventBySlug } from '@/app/utils';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

const EventTokens = dynamic(() => import('@/app/components/Event/EventTokens'), { ssr: false });
const AcquireToken = dynamic(() => import('@/app/components/AcquireToken/AcquireToken'), { ssr: false });
const TokensLeft = dynamic(() => import('@/app/components/TokensLeft/TokensLeft'), { ssr: false });

export default async function Tokens({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  const event = await getEventBySlug(slug, ['name', 'chainId', 'winterProjectId', 'collectionImageUrl'], true);
  const { id, chainId, winterProjectId, collectionImage } = event;

  return (
    <>
      <EventName name={event.name} />
      <h1 className="text-xl text-white mb-2">
        <TokensLeft
          id={id}
          chainId={chainId}
          additionalContent={
            <>
              <br />
              <span>dostępnych tokenów</span>
            </>
          }
        />
      </h1>
      <AcquireToken
        eventId={id}
        chainId={chainId as string}
        winterProjectId={winterProjectId}
        collectionImage={collectionImage}
      />
      <EventTokens {...event} />
    </>
  );
}
