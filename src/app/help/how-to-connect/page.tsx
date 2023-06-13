import EventName from '@/app/components/Event/EventName';
import { helpNavigationItems } from '@/app/consts/navigation-items.const';
import { StrapiService } from '@/app/services/strapi.service';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

const HowTo = dynamic(() => import('@/app/components/HowTo/HowTo'), { ssr: false });

export default async function HowToConnect(): Promise<ReactElement> {
  const {
    data: {
      attributes: { description }
    }
  } = await StrapiService.getHowToConnect();
  return (
    <>
      <EventName name={helpNavigationItems[0].label} className="!text-white" />
      <HowTo description={description} />
    </>
  );
}
