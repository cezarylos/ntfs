import EventName from '@/app/components/Event/EventName';
import Tile from '@/app/components/shared/Tile/Tile';
import { eventNavigationItems, EventNavigationRoutes } from '@/app/consts/navigation-items.const';
import { getEventBySlug } from '@/app/utils';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

const TokensLeft = dynamic(() => import('@/app/components/TokensLeft/TokensLeft'), { ssr: false });

export default async function Page({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  const { id, name, chainId } = await getEventBySlug(slug, ['name', 'chainId']);

  return (
    <div className="h-full flex flex-col">
      <EventName name={name} />
      <div className="grid grid-rows-4 flex-grow gap-4">
        {eventNavigationItems.map(({ label, href }, idx) => (
          <Tile
            key={idx}
            alternateWrapper={{
              component: Link,
              props: {
                href: `/events/${slug}${href}`,
                key: `${slug}_${idx}`
              }
            }}
            mainText={label}
            styledTileIdx={idx}
            secondaryContent={
              <>
                {href === EventNavigationRoutes.TOKENS && (
                  <span className="absolute w-full left-0 right-0 m-auto text-violet-950">
                    <TokensLeft id={id} chainId={chainId} />
                  </span>
                )}
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
