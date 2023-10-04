import { selectExtraLoadingInfo, selectIsLoading } from '@/app/store/global/global.slice';
import { useAppSelector } from '@/app/store/store';
import Image from 'next/image';
import React, { ReactElement } from 'react';

export default function GlobalLoader(): ReactElement {
  const isLoading = useAppSelector(selectIsLoading);
  const extraLoadingInfo = useAppSelector(selectExtraLoadingInfo);

  return isLoading ? (
    <div className="h-screen w-screen top-0 left-0 fixed bg-green-400/80 z-[5000] pointer-events-none flex flex-col items-center justify-center">
      <div className="absolute left-0 right-0 translate-y-[-5.5rem] m-auto h-[7rem] w-[7rem]">
        <Image
          src={'/logo1.gif'}
          width={0}
          height={0}
          alt={'Logo'}
          fill={false}
          priority
          sizes={'100vw'}
          style={{ width: 'auto', height: '7rem' }}
        />
      </div>
      <h1 className="animate-pulse text-white text-4xl">Ładowanie...</h1>
      {extraLoadingInfo && (
        <h1 className="font-inter text-white text-2xl absolute top-24 bottom-0 right-0 left-0 m-auto w-fit h-fit whitespace-break-spaces text-center">
          {extraLoadingInfo}
        </h1>
      )}
    </div>
  ) : (
    <></>
  );
}
