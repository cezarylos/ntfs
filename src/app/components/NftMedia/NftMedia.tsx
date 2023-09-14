'use client';

import { classNames } from '@/app/utils';
import Image from 'next/image';
import React, { ReactElement } from 'react';
import GifPlayer from 'react-gif-player';

import styles from './NftMedia.module.scss';

interface Props {
  imageSrc: string;
  style?: Record<string, string>;
  className?: string;
  isAutoPlay?: boolean;
  isGif?: boolean;
}

export default function NftMedia({ style, className, imageSrc, isAutoPlay, isGif }: Props): ReactElement {
  return (
    <>
      {isGif ? (
        <div className={classNames(className, styles.nftMedia)}>
          <GifPlayer gif={imageSrc} autoplay={isAutoPlay} />
        </div>
      ) : (
        <Image
          src={imageSrc}
          alt={'img'}
          width={0}
          height={0}
          fill={false}
          priority
          sizes={'100vw'}
          style={style}
          className={className}
        />
      )}
    </>
  );
}
