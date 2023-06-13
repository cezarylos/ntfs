import { classNames } from '@/app/utils';
import Link from 'next/link';
import React, { ReactElement } from 'react';

interface Props {
  name: string;
  className?: string;
  bgClassName?: string;
  slug?: string;
}

export default function EventName({ name, className, slug, bgClassName }: Props): ReactElement {
  const content = (
    <span
      className={classNames(
        'before:block before:absolute before:-inset-1 before:-skew-y-3 before:h-[90%] before:bg-pink-500 relative inline-block before:translate-x-[-0.5rem]',
        bgClassName
      )}
    >
      <h1
        className={classNames(
          'text-3xl font-bold mb-2 text-white relative border-transparent uppercase',
          slug && 'hover:brightness-110',
          className || ''
        )}
      >
        {name}
      </h1>
    </span>
  );

  return slug ? (
    <Link className="outline-none" href={`/events/${slug}`}>
      {content}
    </Link>
  ) : (
    content
  );
}
