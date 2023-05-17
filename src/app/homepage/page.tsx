import { StrapiService } from '@/app/services/strapi.service';
import { ReactElement } from 'react';
import dynamic from 'next/dynamic';
const Homepage = dynamic(() => import('../components/homepage/homepage'), { ssr: false });

export default async function HomepageWrapper(): Promise<ReactElement> {
  const events = await StrapiService.getAllEvents(['eventName', 'eventDescription']);
  return (
    events && <Homepage events={events} />
  );
}
