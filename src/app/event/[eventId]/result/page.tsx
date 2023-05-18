import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

const Result = dynamic(() => import('../../../components/event/result'), { ssr: false });

export default async function Page({ params }: { params: { eventId: string } }): Promise<ReactElement> {
  return <Result eventId={params.eventId} />;
}
