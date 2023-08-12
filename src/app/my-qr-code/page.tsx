import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

const MyQrCodeComponent = dynamic(() => import('@/app/components/MyQrCode/MyQrCode'), { ssr: false });

export default async function MyQrCode(): Promise<ReactElement> {
  return <MyQrCodeComponent />;
}
