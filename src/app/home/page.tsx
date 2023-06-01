import Tile from '@/app/components/shared/Tile/Tile';
import { navigationItems } from '@/app/consts/navigation-items.const';
import Link from 'next/link';
import { ReactElement } from 'react';

export default async function Home(): Promise<ReactElement> {
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-rows-4 flex-grow gap-4">
        {navigationItems.map(({ label, href }, index) => (
          <Tile
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
          />
        ))}
      </div>
    </div>
  );
}
