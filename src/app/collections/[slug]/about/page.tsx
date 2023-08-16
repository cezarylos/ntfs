import EventName from '@/app/components/Event/EventName';
import SocialLinks from '@/app/components/SocialLinks/SocialLinks';
import SubheaderUnderlined from '@/app/components/SubheaderUnderlined/SubheaderUnderlined';
import { StrapiService } from '@/app/services/strapi.service';
import { classNames } from '@/app/utils';
import { marked } from 'marked';
import Image from 'next/image';
import React, { ReactElement } from 'react';

import styles from './About.module.scss';

export const metadata = {
  title: 'RealBrain'
};

export default async function About({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  const eventResponse = await StrapiService.getEventBySlug(slug, ['name', 'description', 'picture', 'socialLinks']);
  const { name, picture, description, socialLinks } = eventResponse.data[0].attributes;
  return (
    <>
      <EventName name={name} />
      <SubheaderUnderlined name={'Informacje'} />
      <SocialLinks socialLinks={socialLinks} />
      <div className="relative w-full h-auto my-4">
        <div className="w-full h-full rounded-md overflow-clip">
          <Image
            src={picture?.data?.attributes?.url}
            width={0}
            height={0}
            alt={'tło'}
            fill={false}
            priority
            sizes={'100vw'}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>
      <div
        className={classNames('mt-4 text-[1.2rem] text-left pb-4', styles.description)}
        dangerouslySetInnerHTML={{
          __html: marked.parse(description, { mangle: false, headerIds: false })
        }}
      />
    </>
  );
}
