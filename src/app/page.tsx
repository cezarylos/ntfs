import Tile from '@/app/components/shared/Tile/Tile';
import { EventNavigationRoutes, navigationItems, NavigationRoutes } from '@/app/consts/navigation-items.const';
import Link from 'next/link';
import React, { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

export default async function Home(): Promise<ReactElement> {
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-rows-4 flex-grow gap-4">
        {navigationItems.map(({ label, href, isTwoLiner }, index) => (
          <Tile
            isTwoLiner={isTwoLiner}
            key={index}
            alternateWrapper={{
              component: Link,
              props: {
                href,
                key: index
              }
            }}
            mainText={label}
            styledTileIdx={index}
            hasAccent
          />
        ))}
      </div>
    </div>
  );
}
