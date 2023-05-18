import Event from '@/app/components/event/event';
import { StrapiService } from '@/app/services/strapi.service';
import { ReactElement } from 'react';

export default async function Page({ params }: { params: { eventId: string } }): Promise<ReactElement> {
  const eventResponse = await StrapiService.getEventById(params.eventId, ['chainId', 'winterProjectId']);
  const event = { ...eventResponse.data.attributes, id: eventResponse.data.id };
  return <Event {...event} />;
}
