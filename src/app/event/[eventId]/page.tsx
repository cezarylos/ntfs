import { ReactElement } from 'react';
import { StrapiService } from '@/app/services/strapi.service';
import Event from '@/app/components/event';

export default async function Page({ params }: { eventId: string }): Promise<ReactElement> {

  const eventResponse = await StrapiService.getEvent(params.eventId);

  const event = { ...eventResponse.data.attributes, id: eventResponse.data.id };

  return <Event {...event} />;
}
