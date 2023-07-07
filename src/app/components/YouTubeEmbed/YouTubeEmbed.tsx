import React, { ReactElement } from 'react';

interface Props {
  videoSlug: string;
  className?: string;
}

export default function YouTubeEmbed({ videoSlug, className }: Props): ReactElement {
  return (
    <iframe
      className={className}
      src={`https://www.youtube.com/embed/${videoSlug}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}
