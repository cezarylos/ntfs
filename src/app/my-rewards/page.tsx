import Tile from '@/app/components/shared/Tile/Tile';
import { StrapiService } from '@/app/services/strapi.service';
import { EventInterface } from '@/app/typings/event.interface';
import { DateTime } from 'luxon';
import Link from 'next/link';
import React, { ReactElement } from 'react';

const populateFields = ['name', 'startDate', 'endDate', 'slug'];

export default async function MyTokens(): Promise<ReactElement> {
  const events = await StrapiService.getAllEvents(populateFields);
  return (
    <>
      {!!events?.length && (
        <div className="grid grid-rows-4 h-full gap-4">
          {events.map(({ id, startDate, endDate, name, slug }: EventInterface, idx) => (
            <Tile
              key={idx}
              alternateWrapper={{
                component: Link,
                props: {
                  href: `/my-rewards/${slug}`,
                  key: `${id}_${idx}`
                }
              }}
              mainText={name}
              styledTileIdx={idx}
              secondaryContent={
                <>
                  {DateTime.fromISO(startDate as any).toFormat('dd.MM.yyyy')}
                  {endDate && (
                    <>
                      <span className="mx-1">-</span>
                      {DateTime.fromISO(endDate as any).toFormat('dd.MM.yyyy')}
                    </>
                  )}
                </>
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
