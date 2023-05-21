import { eventNavigationItems } from '@/app/consts/navigation-items.const';
import { StrapiService } from '@/app/services/strapi.service';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import EventName from '@/app/components/Event/EventName';

export default async function Page({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  // const eventResponse = await StrapiService.getEventBySlug(slug, [
  //   'chainId',
  //   'winterProjectId',
  //   'picture',
  //   'name',
  //   'description',
  //   'startDate',
  //   'endDate'
  // ]);
  const eventResponse = await StrapiService.getEventBySlug(slug, ['name']);
  const { name } = { ...eventResponse.data[0].attributes, id: eventResponse.data[0].id };

  return (
    <>
      <EventName name={name} />
      <div className="grid grid-rows-4 h-full gap-4">
        {eventNavigationItems.map(({ label, href }, idx) => (
          <Link
            href={`/events/${slug}${href}`}
            key={`${slug}_${idx}`}
            className="grid-row w-min-full flex justify-center items-center bg-amber-400 hover:bg-amber-300 rounded-lg"
          >
            <h1 className="font-mogra text-green-700 text-3xl">{label}</h1>
          </Link>
        ))}
      </div>
    </>
  );
}
