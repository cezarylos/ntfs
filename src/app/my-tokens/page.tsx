import EventName from '@/app/components/Event/EventName';
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
      <EventName name={'Wybierz Event:'} className={'text-green-200'} />
      {!!events?.length && (
        <div className="grid grid-rows-4 h-full gap-4">
          {events.map(({ id, startDate, endDate, name, slug }: EventInterface, idx) => (
            <Link
              href={`/my-tokens/${slug}`}
              key={`${id}_${idx}`}
              className="grid-row w-min-full flex flex-col justify-center items-center bg-amber-400 hover:bg-amber-300 rounded-lg"
            >
              <div className="relative w-full text-center">
                <h1 className="font-mogra text-green-700 text-3xl w-full">{name}</h1>
                <span className="absolute w-full left-0 right-0 m-auto">
                  {DateTime.fromISO(startDate as any).toFormat('dd.MM.yyyy')}
                  {endDate && (
                    <>
                      <span className="mx-1">-</span>
                      {DateTime.fromISO(endDate as any).toFormat('dd.MM.yyyy')}
                    </>
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
