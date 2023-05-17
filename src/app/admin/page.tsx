import React, { ReactElement } from 'react';
import { StrapiService } from '@/app/services/strapi.service';
import dynamic from 'next/dynamic';
const Admin = dynamic(() => import('../components/admin/admin'), { ssr: false });


export default async function Page(): Promise<ReactElement> {
  const events = await StrapiService.getAllEvents(['chainId', 'eventName']);
  return <Admin events={events}/>;
}
