import { ReactElement, useState } from 'react';
import { classNames } from '@/app/utils';

interface Props {
  max: number;
  current: number;
  isLoading: boolean;
  className?: string;
}

export default function ProgressBar({ max, current, isLoading, className }: Props): ReactElement {
  const safeCurrent = current > max ? max : current;

  return <div className={classNames(`w-full bg-white h-8 rounded-2xl relative`, className)}>
      {isLoading ?
        <span
          className="animate-pulse absolute top-0 bottom-0 left-0 right-0 m-auto w-full text-center h-fit">Ładowanie...</span> :
        <>
          <div style={{ width: `${(safeCurrent / max * 100).toFixed(2)}%` }}
               className="bg-amber-300 h-full rounded-2xl"/>
          <span
            className="absolute top-0 bottom-0 left-0 right-0 m-auto w-full text-center h-fit">{safeCurrent} / {max}</span>
        </>
      }
    </div>
}
