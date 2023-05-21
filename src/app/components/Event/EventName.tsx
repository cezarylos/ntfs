import React, { ReactElement } from 'react';

export default function EventName({ name }: { name: string }): ReactElement {
  return (
    <h1 className="text-3xl font-bold mb-2 text-pink-400">{name}</h1>
  );
}
