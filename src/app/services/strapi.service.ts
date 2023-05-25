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

const getHeaders = (jwt: string): Headers =>
  new Headers({
    Authorization: `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  });

const cacheOptions = {
  next: {
    revalidate: 60
  }
}

export class StrapiService {
  public static async getAllEvents(fields?: string[]): Promise<EventInterface[]> {
    try {
      const res = await fetch(`${BASE_STRAPI_URL}/api/events${filerFields(fields)}&populate[picture][fields][0]=url`, { ...cacheOptions });
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
        )}`, { ...cacheOptions }
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
        `${BASE_STRAPI_URL}/api/tickets?filters[holderAddress][$eq]=${holderAddress.toLowerCase()}${hasEventId}${noLimitPagination}&populate[ticket][fields][0]=url${isPopulateEvent}`,
        { headers, ...cacheOptions }
      );
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async assignHolderAddressToTicket(jwt: string, ticketId: number, holderAddress: string): Promise<void> {
    try {
      const headers = getHeaders(jwt);
      const res = await axios.put(`${BASE_STRAPI_URL}/api/tickets/${ticketId}`, { data: { holderAddress: holderAddress.toLowerCase() }, headers });
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
}
