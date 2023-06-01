import { classNames } from '@/app/utils';
import dynamic from 'next/dynamic';
import { Inter, Mogra, Archivo, Rubik_Dirt, Bangers, Archivo_Black, Russo_One } from 'next/font/google';
import { ReactElement, ReactNode } from 'react';

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

export const bangers = Bangers({
  subsets: ['latin'],
  variable: '--font-bangers',
  weight: '400'
});

export default function RootLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <html lang="en" className="bg-violet-950 xl:text-[150%] relative h-full overflow-hidden">
      <body className={classNames(mogra.className, 'relative h-screen overflow-hidden top-0')}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
