import { classNames } from '@/app/utils';
import { Analytics } from '@vercel/analytics/react';
import dynamic from 'next/dynamic';
import { Archivo, Mogra } from 'next/font/google';
import React, { ReactElement, ReactNode } from 'react';

import './globals.css';

const AppLayout = dynamic(() => import('@/app/app-layout'), { ssr: false });

export const inter = Archivo({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700']
});

export const mogra = Mogra({
  subsets: ['latin'],
  variable: '--font-mogra',
  weight: '400'
});

export default function RootLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <html lang="en" className="bg-violet-950 xl:text-[150%] relative h-full overflow-hidden">
      <body className={classNames(mogra.className, 'relative h-screen overflow-hidden top-0')}>
        <h1 className="animate-pulse text-white text-4xl absolute top-0 bottom-0 left-0 right-0 m-auto w-fit h-fit">
          Ładowanie...
        </h1>
        <AppLayout>{children}</AppLayout>
        <Analytics />
      </body>
    </html>
  );
}
