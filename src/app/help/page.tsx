import SubheaderUnderlined from '@/app/components/SubheaderUnderlined/SubheaderUnderlined';
import Tile from '@/app/components/shared/Tile/Tile';
import { helpNavigationItems } from '@/app/consts/navigation-items.const';
import { StrapiService } from '@/app/services/strapi.service';
import { SocialLinksEnum } from '@/app/typings/common.typings';
import { getSocialIcon } from '@/app/utils';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

export default async function Help(): Promise<ReactElement> {
  const {
    data: {
      attributes: { socialLinks }
    }
  } = await StrapiService.getOurSocialLinks();

  return (
    <div className="flex flex-col pb-4">
      <div className="grid grid-cols-1 flex-grow gap-4">
        {helpNavigationItems.map(({ label, href }, idx) => (
          <Tile
            key={idx}
            alternateWrapper={{
              component: Link,
              props: {
                href: `/help/${href}`,
                key: idx
              }
            }}
            mainText={label}
            styledTileIdx={idx}
            additionalTileClassName={'h-32'}
          />
        ))}
      </div>
      <div className="mt-4 text-white">
        <SubheaderUnderlined name={'Masz pytanie?'}/>
        <ul className='sm:list-disc'>
          <li className="items-center text-white mb-4 sm:mb-2 text-center sm:text-left">
            Napisz do nas na
            <a
              href={socialLinks[SocialLinksEnum.INSTAGRAM]}
              className="ml-1 items-center text-yellow-400"
              target="_blank"
            >
              <br className="sm:hidden"/>
              <span className=" hover:brightness-110">Instagramie</span>
              <Image
                className="ml-2 mb-1 inline-block"
                src={getSocialIcon(SocialLinksEnum.INSTAGRAM)}
                width={0}
                height={0}
                alt={'social'}
                fill={false}
                priority
                sizes={'100vw'}
                style={{ width: 'auto', height: '1rem' }}
              />
            </a>
          </li>
          <li className="items-center text-white text-center sm:text-left">
            Dołącz do naszego
            <a
              href={socialLinks[SocialLinksEnum.INSTAGRAM]}
              className="ml-1 items-center text-yellow-400"
              target="_blank"
            >
              <br className="sm:hidden"/>
              <span className="hover:brightness-110">Discorda</span>
              <Image
                className="ml-2 mb-1 inline-block"
                src={getSocialIcon(SocialLinksEnum.DISCORD)}
                width={0}
                height={0}
                alt={'social'}
                fill={false}
                priority
                sizes={'100vw'}
                style={{ width: 'auto', height: '1rem' }}
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
