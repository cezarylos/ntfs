import { StrapiService } from '@/app/services/strapi.service';
import { EventInterface } from '@/app/typings/event.interface';
import { DateTime } from 'luxon';
import Link from 'next/link';
import React, { Fragment, ReactElement } from 'react';
import { classNames } from '@/app/utils';
import { tileClassName } from '@/app/consts/shared-classnames';
import { styleTileSets } from '@/app/consts/style-tile-sets';

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
              <Link
                href={`/events/${slug}`}
                key={`${id}_${idx}`}
                className={classNames("grid-row w-min-full flex flex-col justify-center items-center rounded-lg text-white", styleTileSets[idx].background, tileClassName)}
              >
                <div className="relative w-full text-center">
                  <h1 className={classNames("font-mogra text-3xl w-full", styleTileSets[idx].text)}>{name}</h1>
                  <span className={classNames("absolute w-full left-0 right-0 m-auto text-violet-950", styleTileSets[idx].text)}>
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
            ) : (
              <div className={classNames("grid-row w-min-full flex flex-col justify-center items-center rounded-lg", 'hover:scale-100', styleTileSets[idx].background, 'opacity-50')}>
                <div className="relative w-full text-center">
                  <h1 className={classNames("font-mogra text-3xl w-full", styleTileSets[idx].text)}>WKRÓTCE</h1>
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
