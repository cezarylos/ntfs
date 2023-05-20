import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

const MyTicketsComponent = dynamic(() => import('@/app/components/MyTickets/MyTickets'), { ssr: false });

export default async function MyTickets(): Promise<ReactElement> {
  return <MyTicketsComponent />;
}
