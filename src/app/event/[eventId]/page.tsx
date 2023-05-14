import { ReactElement } from 'react';
import { StrapiService } from '@/app/services/strapi.service';
import Event from '@/app/components/event/event';

export default async function Page({ params }: { params: { eventId: string }}): Promise<ReactElement> {

  const eventResponse = await StrapiService.getEventById(params.eventId, ['winterProjectId']);

  const event = { ...eventResponse.data.attributes, id: eventResponse.data.id };

  return <Event {...event} />;
}
