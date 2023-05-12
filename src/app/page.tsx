import Homepage from '@/app/pages/homepage';
import { StrapiService } from '@/app/services/strapi.service';
import { ReactElement } from 'react';
import { EventInterface } from '@/app/typings/event.interface';

export default async function Home(): Promise<ReactElement> {
  const response = await StrapiService.getEvents();
  const events = response.data.map(({ attributes, id }: { attributes: Partial<EventInterface>, id: number }) =>
    ({ ...attributes, id }));

  return (
    events && <Homepage events={events} />
  );
}
