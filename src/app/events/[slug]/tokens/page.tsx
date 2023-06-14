import EventName from '@/app/components/Event/EventName';
import SubheaderUnderlined from '@/app/components/SubheaderUnderlined/SubheaderUnderlined';
import { EventNavigationRoutes, NavigationRoutes } from '@/app/consts/navigation-items.const';
import { getEventBySlug, getTokenWord } from '@/app/utils';
import { DateTime } from 'luxon';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { ReactElement } from 'react';

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
  const { id, chainId, winterProjectId, collectionImage, amountOfTokensToGetReward, rewardTitle, giveawayStartDate } =
    event;

  return (
    <div className="pb-4">
      <EventName name={event.name} slug={slug} />
      <SubheaderUnderlined name={'Zgarnij Token'} />
      <div className="mt-2 bg-purple-400 p-2 sm:p-4 rounded-2xl">
        <p className="text-lg sm:text-xl text-purple-950">
          Zdobądź{' '}
          <span className="text-yellow-300 uppercase">
            {amountOfTokensToGetReward} {getTokenWord(amountOfTokensToGetReward)}
          </span>{' '}
          i otrzymaj:
        </p>
        <p className="text-yellow-300 text-xl sm:text-2xl text-center uppercase">
          {rewardTitle}
        </p>
        <h1 className="text-base sm:text-lg text-purple-950 text-center mt-2 uppercase">
          Rozdanie nagród odbędzię się <br/>
          <span className='text-pink-800 text-lg mb-2'>{DateTime.fromISO(giveawayStartDate).toFormat('dd/MM/yyyy')}</span>
        </h1>
        <Link
          href={`${NavigationRoutes.EVENTS}/${slug}${EventNavigationRoutes.REWARDS}`}
        >
          <span className={'block text-center mt-2 text-yellow-300 text-base uppercase w-full hover:brightness-110 leading-none'}>Sprawdź swoje nagrody</span>
        </Link>
      </div>
      <h1 className="text-xl text-white my-2 text-center">
        <TokensLeft id={id} chainId={chainId} hasSuffix />
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
