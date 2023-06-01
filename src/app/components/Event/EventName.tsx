import { classNames } from '@/app/utils';
import Link from 'next/link';
import React, { ReactElement } from 'react';

interface Props {
  name: string;
  className?: string;
  slug?: string;
}

export default function EventName({ name, className, slug }: Props): ReactElement {
  const content = (
    <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:h-[90%] before:bg-pink-500 relative inline-block before:translate-x-[-0.5rem]">
      <h1
        className={classNames(
          'text-3xl font-bold mb-2 text-yellow-300 outline-0 relative',
          slug && 'hover:brightness-110',
          className || ''
        )}
      >
        {name}
      </h1>
    </span>
  );

  return slug ? (
    <Link className="outline-0" href={`/events/${slug}`}>
      {content}
    </Link>
  ) : (
    content
  );
}
