import SubheaderUnderlined from '@/app/components/SubheaderUnderlined/SubheaderUnderlined';
import Tile from '@/app/components/shared/Tile/Tile';
import { helpNavigationItems, HelpNavigationRoutes } from '@/app/consts/navigation-items.const';
import { StrapiService } from '@/app/services/strapi.service';
import { SocialLinksEnum } from '@/app/typings/common.typings';
import { getSocialIcon } from '@/app/utils';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactElement } from 'react';

export const metadata = {
  title: 'RealBrain'
};

const HowTo = dynamic(() => import('@/app/components/HowTo/HowTo'), { ssr: false });

export default async function Help(): Promise<ReactElement> {
  const [
    {
      data: {
        attributes: { description }
      }
    },
    {
      data: {
        attributes: { socialLinks }
      }
    }
  ] = await Promise.all([StrapiService.getHowTo(), StrapiService.getOurSocialLinks()]);

  return (
    <div className="flex flex-col pb-4">
      <HowTo description={description} />
      <SubheaderUnderlined name={'Masz pytania?'} />
      <Link href={`/help/${HelpNavigationRoutes.HOW_TO_CONNECT}`}>
        <button className="rounded-md shadow-xl text-white bg-pink-500 font-semibold p-2 text-base hover:brightness-110 font-inter w-full my-4">
          Dowiedz się jak podłączyć portfel
        </button>
      </Link>
      <div className="mt-4 text-white text-lg sm:text-base pb-4">
        <ul>
          <li className="items-center text-white mb-4 sm:mb-2 text-center leading-tight">
            Napisz do nas na
            <a
              href={socialLinks[SocialLinksEnum.INSTAGRAM]}
              className="ml-1 items-center text-yellow-400"
              target="_blank"
            >
              <br className="sm:hidden" />
              <span className=" hover:brightness-110">Instagramie</span>
              <Image
                className="ml-2 mb-0.5 inline-block"
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
          <li className="items-center text-white text-center">
            Dołącz do naszego
            <a
              href={socialLinks[SocialLinksEnum.DISCORD]}
              className="ml-1 items-center text-yellow-400"
              target="_blank"
            >
              <br className="sm:hidden" />
              <span className="hover:brightness-110">Discorda</span>
              <Image
                className="ml-2 inline-block"
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
