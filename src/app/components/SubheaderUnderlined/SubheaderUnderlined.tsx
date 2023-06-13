import { classNames } from '@/app/utils';
import React, { ReactElement } from 'react';

interface Props {
  name: string;
  className?: string;
  bgClassName?: string;
}

export default function SubheaderUnderlined({ name, className, bgClassName }: Props): ReactElement {
  return (
    <span
      className={classNames(
        'before:block before:absolute before:-inset-1 before:-skew-y-3 before:h-[15%] before:bg-pink-500 relative inline-block before:translate-y-[1.5rem] w-fit',
        bgClassName
      )}
    >
      <h2
        className={classNames(
          'text-2xl font-bold mb-2 text-white relative border-transparent uppercase',
          className || ''
        )}
      >
        {name}
      </h2>
    </span>
  );
}
