import { StrapiService } from '@/app/services/strapi.service';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

const Homepage = dynamic(() => import('@/app/components/Homepage/Homepage'), { ssr: false });

const populateFields = [
  'name',
  'description',
  'startDate'
];

export default async function App(): Promise<ReactElement> {
  const events = await StrapiService.getAllEvents(populateFields);
  return events && <Homepage events={events} />;
}
