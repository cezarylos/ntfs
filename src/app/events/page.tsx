import Tile from '@/app/components/shared/Tile/Tile';
import { StrapiService } from '@/app/services/strapi.service';
import { EventInterface } from '@/app/typings/event.interface';
import { DateTime } from 'luxon';
import Link from 'next/link';
import React, { Fragment, ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

const populateFields = ['name', 'startDate', 'endDate', 'slug'];

const soon = Array(2).fill({});

export default async function Events(): Promise<ReactElement> {
  const events = await StrapiService.getAllEvents(populateFields);
  return (
    <div className="h-[calc(100%-3.5rem)] flex flex-col">
      <div className="grid grid-rows-3 flex-grow gap-4">
        {[...events, ...soon].map(({ id, startDate, endDate, name, slug }: EventInterface, idx) => (
          <Fragment key={idx}>
            {slug ? (
              <Tile
                alternateWrapper={{
                  component: Link,
                  props: {
                    href: `/events/${slug}`,
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
            ) : (
              <Tile
                mainText={'WKRÓTCE'}
                styledTileIdx={idx + 1}
                additionalTileClassName={'hover:scale-100 opacity-50'}
                isActive={false}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
