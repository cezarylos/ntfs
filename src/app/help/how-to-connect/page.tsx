import EventName from '@/app/components/Event/EventName';
import YouTubeEmbed from '@/app/components/YouTubeEmbed/YouTubeEmbed';
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
      attributes: { description, videoSlug }
    }
  } = await StrapiService.getHowToConnect();
  return (
    <>
      <EventName name={helpNavigationItems[0].label} className="!text-white" />
      {videoSlug && (
        <div className="mt-2 w-full">
          <YouTubeEmbed videoSlug={videoSlug} className={'w-full h-[33.33vh]'} />
        </div>
      )}
      <HowTo description={description} />
    </>
  );
}
