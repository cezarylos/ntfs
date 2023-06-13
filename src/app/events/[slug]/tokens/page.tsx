import EventName from '@/app/components/Event/EventName';
import { getEventBySlug } from '@/app/utils';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import SubheaderUnderlined from '@/app/components/SubheaderUnderlined/SubheaderUnderlined';

export const metadata = {
  title: 'RealBrain'
};

const EventTokens = dynamic(() => import('@/app/components/Event/EventTokens'), { ssr: false });
const AcquireToken = dynamic(() => import('@/app/components/AcquireToken/AcquireToken'), { ssr: false });
const TokensLeft = dynamic(() => import('@/app/components/TokensLeft/TokensLeft'), { ssr: false });

export default async function Tokens({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  const event = await getEventBySlug(
    slug,
    ['name', 'chainId', 'winterProjectId', 'amountOfTokensToGetReward', 'rewardTitle', 'giveawayStartDate'],
    true
  );
  const { id, chainId, winterProjectId, collectionImage, amountOfTokensToGetReward, rewardTitle, giveawayStartDate } = event;

  return (
    <div className="pb-4">
      <EventName name={event.name} slug={slug} />
      <SubheaderUnderlined name={'Zgarnij Token'} />
      <div className="my-4 sm:my-6">
        <p className="text-xl text-white">
          Zdobądź <span className="text-yellow-300">{amountOfTokensToGetReward} TOKENÓW</span> i otrzymaj:
        </p>
        <p className="text-transparent bg-gradient-to-r bg-clip-text from-cyan-500 to-yellow-500 text-2xl text-center uppercase">
          {rewardTitle}
        </p>
      </div>
      <h1 className="text-xl text-white my-2 text-center">
        <TokensLeft id={id} chainId={chainId} />
        <span className="text-yellow-300 ml-1">TOKENÓW</span>
      </h1>
      <AcquireToken
        eventId={id}
        chainId={chainId as string}
        winterProjectId={winterProjectId}
        collectionImage={collectionImage}
        amountOfTokensToGetReward={amountOfTokensToGetReward}
      />
      <EventTokens {...event} />
    </div>
  );
}
