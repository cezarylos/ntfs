import Homepage from '@/app/components/homepage';
import { StrapiService } from '@/app/services/strapi.service';
import { ReactElement } from 'react';

export default async function HomepageWrapper(): Promise<ReactElement> {
  const events = await StrapiService.getAllEvents(['eventName', 'eventDescription']);
  return (
    events && <Homepage events={events} />
  );
}
