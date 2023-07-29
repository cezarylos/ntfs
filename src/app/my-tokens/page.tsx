import SubheaderUnderlined from '@/app/components/SubheaderUnderlined/SubheaderUnderlined';
import Tile from '@/app/components/shared/Tile/Tile';
import { StrapiService } from '@/app/services/strapi.service';
import { EventInterface } from '@/app/typings/event.interface';
import { DateTime } from 'luxon';
import Link from 'next/link';
import React, { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

const populateFields = ['name', 'startDate', 'endDate', 'slug'];

export default async function MyTokens(): Promise<ReactElement> {
  const events = await StrapiService.getAllEvents(populateFields);
  return (
    <>
      <SubheaderUnderlined name={'Wybierz Kolekcję:'} />
      {!!events?.length && (
        <div className="grid grid-rows-4 h-full gap-4">
          {events.map(({ id, startDate, endDate, name, slug }: EventInterface, idx) => (
            <Tile
              key={idx}
              alternateWrapper={{
                component: Link,
                props: {
                  href: `/my-tokens/${slug}`,
                  key: `${id}_${idx}`
                }
              }}
              mainText={name}
              styledTileIdx={idx}
              secondaryContent={
                <>
                  {startDate && DateTime.fromISO(startDate, { zone: 'Europe/Warsaw' }).toFormat('dd.MM.yyyy')}
                  {endDate && (
                    <>
                      <span className="mx-1">-</span>
                      {DateTime.fromISO(endDate, { zone: 'Europe/Warsaw' }).toFormat('dd.MM.yyyy')}
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
