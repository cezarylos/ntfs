import { classNames } from '@/app/utils';
import dynamic from 'next/dynamic';
import { Inter, Mogra } from 'next/font/google';
import { ReactElement, ReactNode } from 'react';

import './globals.css';

const AppLayout = dynamic(() => import('@/app/app-layout'), { ssr: false });

export const inter = Inter({
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
    <html lang="en" className="bg-violet-500 xl:text-[150%]">
      <body className={classNames(mogra.className, ' relative h-screen overflow-hidden flex flex-col')}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
