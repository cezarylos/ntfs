import { SocialLinksEnum } from '@/app/typings/common.typings';
import { getSocialIcon } from '@/app/utils';
import Image from 'next/image';
import React, { ReactElement } from 'react';

interface Props {
  socialLinks: Record<SocialLinksEnum, string>;
}

export default function SocialLinks({ socialLinks }: Props): ReactElement {
  return (
    <div className="flex flex-wrap justify-center items-center gap-8">
      {Object.keys(socialLinks)?.map(key => {
        return (
          <a key={key} className="w-10 hover:brightness-110" href={socialLinks[key as SocialLinksEnum]} target="_blank">
            <Image
              src={getSocialIcon(key as SocialLinksEnum)}
              width={0}
              height={0}
              alt={'social'}
              fill={false}
              priority
              sizes={'100vw'}
              style={{ width: '100%', height: '100%' }}
            />
          </a>
        );
      })}
    </div>
  );
}
