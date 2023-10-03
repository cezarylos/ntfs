import { StrapiService } from '@/app/services/strapi.service';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'RealBrain'
};

export default async function PosterQrCode(): Promise<void> {
  const { data } = await StrapiService.getPosterQrCodeUrl();
  const { url } = data.attributes;
  redirect(url);
}
