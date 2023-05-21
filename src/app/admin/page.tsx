import { StrapiService } from '@/app/services/strapi.service';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

const Admin = dynamic(() => import('@/app/components/Admin/Admin'), { ssr: false });

export default async function Page(): Promise<ReactElement> {
  const events = await StrapiService.getAllEvents(['chainId', 'name']);
  return <Admin events={events} />;
}
