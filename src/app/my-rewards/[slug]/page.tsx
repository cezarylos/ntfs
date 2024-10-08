import { getEventBySlug } from '@/app/utils';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

const MyTicketsComponent = dynamic(() => import('@/app/components/MyTickets/MyTickets'), { ssr: false });

export default async function MyTickets({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  const { id, name, chainId } = await getEventBySlug(slug, ['name', 'chainId']);

  return <MyTicketsComponent id={id} name={name} slug={slug} chainId={chainId} />;
}
