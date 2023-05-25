import EventName from '@/app/components/Event/EventName';
import { eventNavigationItems, EventNavigationRoutes } from '@/app/consts/navigation-items.const';
import { getEventBySlug } from '@/app/utils';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { ReactElement } from 'react';

const TokensLeft = dynamic(() => import('@/app/components/TokensLeft/TokensLeft'), { ssr: false });

export default async function Page({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  const { id, name, chainId } = await getEventBySlug(slug, ['name', 'chainId']);

  return (
    <div className="h-full flex flex-col">
      <EventName name={name} />
        <div className="grid grid-rows-4 flex-grow gap-4">
        {eventNavigationItems.map(({ label, href }, idx) => (
          <Link
            href={`/events/${slug}${href}`}
            key={`${slug}_${idx}`}
            className="grid-row w-min-full flex flex-col justify-center items-center bg-amber-400 hover:bg-amber-300 rounded-lg"
          >
            <div className="relative w-full text-center">
              <h1 className="font-mogra text-green-700 text-3xl w-full">{label}</h1>
              {href === EventNavigationRoutes.TOKENS && (
                <span className="absolute w-full left-0 right-0 m-auto">
                  <TokensLeft id={id} chainId={chainId} />
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
