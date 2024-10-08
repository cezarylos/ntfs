import EventName from '@/app/components/Event/EventName';
import SubheaderUnderlined from '@/app/components/SubheaderUnderlined/SubheaderUnderlined';
import { EventNavigationRoutes, NavigationRoutes } from '@/app/consts/navigation-items.const';
import { getEventBySlug, getTokenWord } from '@/app/utils';
import { marked } from 'marked';
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
    [
      'name',
      'chainId',
      'checkoutProjectId',
      'checkoutCollectionId',
      'amountOfTokensToGetReward',
      'rewardTitle',
      'contractAddress',
      'maxTokensPerWallet'
    ],
    true
  );
  const {
    id,
    chainId,
    checkoutProjectId,
    collectionImage,
    amountOfTokensToGetReward,
    rewardTitle,
    checkoutCollectionId,
    maxTokensPerWallet
  } = event;

  return (
    <div className="pb-4 flex flex-col">
      <EventName name={event.name} slug={slug} />
      <SubheaderUnderlined name={'Kup Token'} />
      {rewardTitle && (
        <div className="mt-2 bg-purple-400 p-2 sm:p-4 rounded-2xl">
          <p className="text-lg sm:text-xl text-purple-950">
            Kup{' '}
            <span className="text-yellow-300 uppercase">
              {amountOfTokensToGetReward} {getTokenWord(amountOfTokensToGetReward)}
            </span>{' '}
            i otrzymaj:
          </p>
          <div
            className="text-yellow-300 text-xl sm:text-2xl text-center uppercase mb-2"
            dangerouslySetInnerHTML={{
              __html: marked
                .parse(rewardTitle || '', { mangle: false, headerIds: false })
                .replace('<p', '<p class="text-white text-md sm:text-lg"')
            }}
          />
          <Link href={`${NavigationRoutes.COLLECTIONS}/${slug}${EventNavigationRoutes.REWARDS}`}>
            <button className="rounded-md shadow-xl m-auto block text-white bg-pink-500 font-semibold p-2 uppercase text-sm hover:brightness-110 w-fit">
              Sprawdź swoje nagrody
            </button>
          </Link>
        </div>
      )}
      <h1 className="text-xl text-white my-2 text-center">
        <TokensLeft id={id} chainId={chainId} hasSuffix />
      </h1>
      <AcquireToken
        slug={slug}
        eventId={id}
        chainId={chainId as string}
        checkoutProjectId={checkoutProjectId}
        collectionImage={collectionImage}
        amountOfTokensToGetReward={amountOfTokensToGetReward}
        checkoutCollectionId={checkoutCollectionId}
        maxTokensPerWallet={maxTokensPerWallet}
      />
      <EventTokens {...event} />
    </div>
  );
}
