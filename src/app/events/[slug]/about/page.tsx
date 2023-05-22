import { StrapiService } from '@/app/services/strapi.service';
import { marked } from 'marked';
import Image from 'next/image';
import React, { ReactElement } from 'react';

export default async function About({ params: { slug } }: { params: { slug: string } }): Promise<ReactElement> {
  const eventResponse = await StrapiService.getEventBySlug(slug, ['description', 'picture']);
  const { picture, description } = eventResponse.data[0].attributes;
  return (
    <>
      <div className="relative w-full h-auto rounded-md overflow-clip">
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${picture?.data.attributes.url}`}
          width={0}
          height={0}
          alt={'tło'}
          fill={false}
          priority
          sizes={'100vw'}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <h4
        className="font-inter mt-4 text-[1.2rem] text-left pb-10"
        dangerouslySetInnerHTML={{
          __html: marked.parse(description, { mangle: false, headerIds: false })
        }}
      />
    </>
  );
}
