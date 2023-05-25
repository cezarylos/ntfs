import { classNames } from '@/app/utils';
import React, { ReactElement } from 'react';
import Link from 'next/link';

interface Props {
  name: string;
  className?: string;
  slug?: string;
}

export default function EventName({ name, className, slug }: Props): ReactElement {
  const content = <h1
    className={classNames('text-3xl font-bold mb-2 text-pink-400 outline-0', slug && 'hover:brightness-110', className || '')}>{name}</h1>;

  return slug ? <Link
      className="outline-0"
      href={`/events/${slug}`}
    >
      {content}
    </Link> :
    content
}
