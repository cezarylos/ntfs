import { ReactElement } from 'react';
import Result from '@/app/components/event/result';

export default async function Page({ params }: { params: { eventId: string } }): Promise<ReactElement> {
  return <Result eventId={params.eventId} />;
}
