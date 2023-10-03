import { SocialLinksEnum } from '@/app/typings/common.typings';
import { EventInterface } from '@/app/typings/event.interface';
import { StrapiArrayResponseInterface, StrapiResponseInterface } from '@/app/typings/strapiResponse.interface';
import { TicketInterface } from '@/app/typings/ticket.interface';

import axios, { AxiosPromise } from 'axios';

export const BASE_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;
const noLimitPagination = '&pagination[limit]=-1';

const filerFields = (fields: string[] = [], isFirstParam = true): string =>
  fields?.length
    ? `${isFirstParam ? '?' : '&'}${fields.map((field: string, idx: number) => `fields[${idx}]=${field}`).join('&')}`
    : '';

const getHeaders = (jwt: string) => ({
  Authorization: `Bearer ${jwt}`,
  'Content-Type': 'application/json'
});

const cacheOptions = {
  next: {
    revalidate: 60
  }
};

export class StrapiService {
  public static async getAllEvents(fields?: string[], isWithRewardsOnly?: boolean): Promise<EventInterface[]> {
    try {
      const filterWithRewardsOnly = isWithRewardsOnly ? '&filters[isCollab][$eq]=false' : '';
      const filterIsNotHidden = '&filters[isHidden][$eq]=false';
      const res = await fetch(
        `${BASE_STRAPI_URL}/api/events${filerFields(
          fields
        )}&populate[picture][fields][0]=url&sort[0]=createdAt:desc${filterWithRewardsOnly}${filterIsNotHidden}${noLimitPagination}`,
        {
          ...cacheOptions
        }
      );
      const resJson = await res.json();
      return resJson.data.map(({ attributes, id }: { attributes: Partial<EventInterface>; id: number }) => ({
        ...attributes,
        id
      }));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getEventById(
    eventId: string,
    fields?: string[]
  ): Promise<StrapiResponseInterface<EventInterface>> {
    try {
      const res = await fetch(`${BASE_STRAPI_URL}/api/events/${eventId}${filerFields(fields)}`, { ...cacheOptions });
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getEventBySlug(
    slug: string,
    fields?: string[],
    hasCollectionImage = false
  ): Promise<StrapiArrayResponseInterface<EventInterface>> {
    try {
      const collectionImage = hasCollectionImage ? '&populate[collectionImage][fields][0]=url' : '';
      const res = await fetch(
        `${BASE_STRAPI_URL}/api/events?filters[slug][$eq]=${slug}&populate[picture][fields][0]=url${collectionImage}${filerFields(
          fields,
          false
        )}`,
        { ...cacheOptions }
      );
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getTicketsByEventId(
    jwt: string,
    eventId: string,
    fields?: string[]
  ): Promise<StrapiArrayResponseInterface<TicketInterface>> {
    try {
      const headers = getHeaders(jwt);
      const res = await fetch(
        `${BASE_STRAPI_URL}/api/tickets?filters[event][id][$eq]=${eventId}${noLimitPagination}${filerFields(
          fields,
          false
        )}`,
        { headers, cache: 'no-cache' }
      );
      return await res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getTicketsByHolderAddress(
    jwt: string,
    holderAddress: string,
    eventId?: string
  ): Promise<StrapiArrayResponseInterface<TicketInterface>> {
    try {
      const hasEventId = eventId ? `&filters[event][id][$eq]=${eventId}` : '';
      const isPopulateEvent = eventId ? '' : '&populate[event][fields][0]=name';
      const headers = getHeaders(jwt);
      const res = await fetch(
        `${BASE_STRAPI_URL}/api/tickets?filters[holderAddress][$eqi]=${holderAddress.toLowerCase()}${hasEventId}${noLimitPagination}&populate[ticket][fields][0]=url${isPopulateEvent}`,
        { headers, cache: 'no-cache' }
      );
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getTicketsWithoutHolderAddress(
    jwt: string,
    eventId: string
  ): Promise<StrapiArrayResponseInterface<TicketInterface>> {
    try {
      const hasEventId = `&filters[event][id][$eq]=${eventId}`;
      const headers = getHeaders(jwt);
      const res = await fetch(
        `${BASE_STRAPI_URL}/api/tickets?filters[holderAddress][$null]=true${hasEventId}${noLimitPagination}`,
        { headers, cache: 'no-cache' }
      );
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getUsedTokens(
    jwt: string,
    eventId: string
  ): Promise<StrapiArrayResponseInterface<TicketInterface>> {
    try {
      const hasEventId = `&filters[event][id][$eq]=${eventId}`;
      const headers = getHeaders(jwt);
      const res = await fetch(
        `${BASE_STRAPI_URL}/api/tickets?filters[tokenIds][$notNull]=true${hasEventId}&pagination[page]=1&pagination[pageSize]=100`,
        {
          headers,
          cache: 'no-cache'
        }
      );
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async assignHolderAddressToTicket(
    jwt: string,
    ticketId: number,
    holderAddress: string,
    tokenIds: number[]
  ): Promise<void> {
    try {
      const headers = getHeaders(jwt);
      const res = await axios.put(
        `${BASE_STRAPI_URL}/api/tickets/${ticketId}`,
        { data: { holderAddress: holderAddress.toLowerCase(), tokenIds } },
        { headers, ...cacheOptions }
      );
      return res.data;
    } catch (e) {
      console.error(e);
    }
  }

  public static async loginAdmin(password: string): AxiosPromise<{ jwt: string }> {
    try {
      const response = await axios.post(`${BASE_STRAPI_URL}/api/auth/local`, {
        identifier: 'admin',
        password
      });
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getHowTo(): Promise<StrapiResponseInterface<{ description: string }>> {
    try {
      const res = await fetch(`${BASE_STRAPI_URL}/api/how-to`, { ...cacheOptions });
      return await res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getHowToConnect(): Promise<StrapiResponseInterface<{ description: string; videoSlug: string }>> {
    try {
      const res = await fetch(`${BASE_STRAPI_URL}/api/how-to-connect`, { ...cacheOptions });
      return await res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getOurSocialLinks(): Promise<
    StrapiResponseInterface<{ socialLinks: Record<SocialLinksEnum, string> }>
  > {
    try {
      const res = await fetch(`${BASE_STRAPI_URL}/api/our-social-link`, { ...cacheOptions });
      return await res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getEncryptionKey(jwt: string): Promise<StrapiResponseInterface<{ key: string }>> {
    try {
      const headers = getHeaders(jwt);
      const res = await fetch(`${BASE_STRAPI_URL}/api/encrypt-key`, { headers, ...cacheOptions });
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getPosterQrCodeUrl(): Promise<StrapiResponseInterface<{ url: string }>> {
    try {
      const res = await fetch(`${BASE_STRAPI_URL}/api/poster-qr-code-link`, { ...cacheOptions });
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
