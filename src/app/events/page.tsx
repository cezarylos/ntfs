import { StrapiService } from '@/app/services/strapi.service';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

const Events = dynamic(() => import('@/app/components/Events/Events'), { ssr: false });

const populateFields = ['name', 'startDate', 'endDate', 'slug'];

export default async function App(): Promise<ReactElement> {
  const events = await StrapiService.getAllEvents(populateFields);
  return events && <Events events={events} />;
}
