import { classNames } from '@/app/utils';
import React, { ReactElement } from 'react';

interface Props {
  name: string;
  className?: string;
}

export default function EventName({ name, className }: Props): ReactElement {
  return <h1 className={classNames('text-3xl font-bold mb-2 text-pink-400', className || '')}>{name}</h1>;
}
