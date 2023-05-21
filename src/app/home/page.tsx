import { navigationItems } from '@/app/consts/navigation-items.const';
import Link from 'next/link';
import { ReactElement } from 'react';

export default async function Home(): Promise<ReactElement> {
  return (
    <div className="grid grid-rows-4 h-full gap-4">
      {navigationItems.map(({ label, href }, index) => (
        <Link
          href={href}
          key={index}
          className="grid-row w-min-full flex justify-center items-center bg-amber-400 hover:bg-amber-300 rounded-lg"
        >
          <span className="font-mogra text-green-700 text-4xl">{label}</span>
        </Link>
      ))}
    </div>
  );
}
