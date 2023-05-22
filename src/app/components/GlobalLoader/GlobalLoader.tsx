import { selectIsLoading } from '@/app/store/global/global.slice';
import { useAppSelector } from '@/app/store/store';
import { ReactElement } from 'react';

export default function GlobalLoader(): ReactElement {
  const isLoading = useAppSelector(selectIsLoading);

  return isLoading ? (
    <div className="h-screen w-screen top-0 left-0 fixed bg-green-400/80 z-50 pointer-events-none flex items-center justify-center">
      <h1 className="animate-pulse text-white text-4xl">Ładowanie...</h1>
    </div>
  ) : (
    <></>
  );
}
