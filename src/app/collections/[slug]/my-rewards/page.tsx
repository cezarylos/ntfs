import { StrapiService } from '@/app/services/strapi.service';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

const MyTicketsComponent = dynamic(() => import('@/app/components/MyTickets/MyTickets'), { ssr: false });

export default async function MyTickets({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  const eventResponse = await StrapiService.getEventBySlug(slug, ['name', 'chainId']);
  const {
    id,
    attributes: { name, chainId }
  } = eventResponse.data[0] || { attributes: {} };

  return <MyTicketsComponent id={id} name={name} slug={slug} chainId={chainId} />;
}
