import React, { ReactElement } from 'react';
import { StrapiService } from '@/app/services/strapi.service';
import Admin from '@/app/components/admin/admin';

export default async function Page(): Promise<ReactElement> {
  const events = await StrapiService.getAllEvents(['chainId', 'eventName']);
  return <Admin events={events}/>;
}
