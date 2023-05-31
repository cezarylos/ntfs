import { classNames } from '@/app/utils';
import React, { ReactElement } from 'react';

interface Props {
  onClick?: () => void;
  isDisabled?: boolean;
  buttonContent?: ReactElement | string;
  className?: string;
}

export default function Button({ onClick, isDisabled, buttonContent, className }: Props): ReactElement {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={classNames(
        'm-auto mt-2 p-4 w-3/4 justify-center bg-pink-400 flex item-center rounded-md hover:brightness-110 disabled:cursor-auto disabled:hover:brightness-100 disabled:bg-gray-500/50',
        className
      )}
    >
      {buttonContent}
    </button>
  );
}
