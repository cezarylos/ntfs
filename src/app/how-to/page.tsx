import { StrapiService } from '@/app/services/strapi.service';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

const HowTo = dynamic(() => import('@/app/components/HowTo/HowTo'), { ssr: false });

export default async function MyTokens(): Promise<ReactElement> {
  const {
    data: {
      attributes: { description }
    }
  } = await StrapiService.getHowTo();
  return <HowTo description={description} />;
}
