import EventName from '@/app/components/Event/EventName';
import Tile from '@/app/components/shared/Tile/Tile';
import { eventNavigationItems, EventNavigationRoutes } from '@/app/consts/navigation-items.const';
import { classNames, getEventBySlug } from '@/app/utils';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

const TokensLeft = dynamic(() => import('@/app/components/TokensLeft/TokensLeft'), { ssr: false });

export default async function Page({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  const { id, name, chainId, isCollab, collectionOpenSeaUrl } = await getEventBySlug(slug, [
    'name',
    'chainId',
    'isCollab',
    'collectionOpenSeaUrl'
  ]);

  const filteredNavigationItems = eventNavigationItems
    .filter(({ href }) => !(isCollab && href === EventNavigationRoutes.REWARDS))
    .map(({ href, ...rest }) => ({
      ...rest,
      href: href === EventNavigationRoutes.GALLERY ? collectionOpenSeaUrl : href,
      isExternal: href === EventNavigationRoutes.GALLERY
    }));

  const myTokensClassName = isCollab ? 'col-span-2' : 'col-span-1';

  return (
    <div className="h-full flex flex-col">
      <EventName name={name} />
      <div className="grid grid-rows-4 grid-cols-2 flex-grow gap-4">
        {filteredNavigationItems.map(({ label, href, className, isExternal }, idx) => (
          <Tile
            key={idx}
            alternateWrapper={{
              component: Link,
              props: {
                href: isExternal ? href : `/collections/${slug}${href}`,
                key: `${slug}_${idx}`,
                target: isExternal ? '_blank' : '_self'
              }
            }}
            additionalTileClassName={classNames(
              className || 'col-span-2',
              href === EventNavigationRoutes.MY_TOKENS && myTokensClassName
            )}
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
