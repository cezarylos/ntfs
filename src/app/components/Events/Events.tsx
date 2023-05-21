'use client';

import MetaMaskLinks from '@/app/components/metamaskLinks';
import { setIsLoading } from '@/app/store/global/global.slice';
import { useAppDispatch } from '@/app/store/store';
import { EventInterface } from '@/app/typings/event.interface';
import { marked } from 'marked';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactElement, useEffect } from 'react';

interface HomeInterface {
  events: EventInterface[];
}

export default function Events({ events }: HomeInterface): ReactElement {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setIsLoading(true));
  }, [dispatch]);

  return (
    <>
      <MetaMaskLinks />
      <div className="grid grid-rows-4 h-full gap-4">
        {events.map(({ id, description, name, slug }: EventInterface, idx) => (
          <Link
            href={`/events/${slug}`}
            key={`${id}_${idx}`}
            className="grid-row w-min-full flex justify-center items-center bg-amber-400 hover:bg-amber-300 rounded-lg"
          >
            {/*<div className='relative h-64 w-full rounded-md overflow-clip'>*/}
            {/*  <Image src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${picture?.data.attributes.url}`} alt={'tło'} fill priority />*/}
            {/*</div>*/}
            <h1 className="font-mogra text-green-700 text-3xl">{name}</h1>
            {/*<h4 className='font-inter text-left'*/}
            {/*  dangerouslySetInnerHTML={{*/}
            {/*    __html: marked*/}
            {/*    .parse(description, { mangle: false, headerIds: false })*/}
            {/*  }}*/}
            {/*/>*/}
          </Link>
        ))}
      </div>
    </>
  );
}
