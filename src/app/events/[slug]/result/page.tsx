import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

const Result = dynamic(() => import('@/app/components/Event/Result'), { ssr: false });

export default async function Page({ params }: { params: { eventId: string } }): Promise<ReactElement> {
  return <Result eventId={params.eventId} />;
}
