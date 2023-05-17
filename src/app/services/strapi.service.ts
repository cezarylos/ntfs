import { EventInterface } from '@/app/typings/event.interface';
import { StrapiArrayResponseInterface, StrapiResponseInterface } from '@/app/typings/strapiResponse.interface';
import { TicketInterface } from '@/app/typings/ticket.interface';
import axios, { AxiosPromise } from 'axios';

export const BASE_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;
const noLimitPagination = '&pagination[limit]=-1';

const filerFields = (fields: string[] = [], isFirstParam = true): string =>
  fields?.length ? `${isFirstParam ? '?' : '&'}${fields.map((field: string, idx: number) => `fields[${idx}]=${field}`).join('&')}` : '';

const getHeaders = (jwt: string): Headers => new Headers({
  'Authorization': `Bearer ${jwt}`,
  'Content-Type': 'application/json'
});

export class StrapiService {
  public static async getAllEvents(fields?: string[]): Promise<EventInterface[]> {
    try {
      const res = await fetch(`${BASE_STRAPI_URL}/api/events${filerFields(fields)}`);
      const resJson = await res.json();
      return resJson.data?.map(({ attributes, id }: { attributes: Partial<EventInterface>, id: number }) =>
        ({ ...attributes, id })) || [];
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getEventById(eventId: string, fields?: string[]): Promise<StrapiResponseInterface<EventInterface>> {
    try {
      const res = await fetch(`${BASE_STRAPI_URL}/api/events/${eventId}${filerFields(fields)}`);
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getTicketsByEventId(jwt: string, eventId: string, fields?: string[]): Promise<StrapiArrayResponseInterface<TicketInterface>> {
    try {
      const headers = getHeaders(jwt);
      const res = await fetch(`${BASE_STRAPI_URL}/api/tickets?filters[event][id][$eq]=${eventId}${noLimitPagination}${filerFields(fields, false)}`,
        { headers });
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async getTicketsByEventIdAndHolderAddress(jwt: string, eventId: string, holderAddress: string): Promise<StrapiArrayResponseInterface<TicketInterface>> {
    try {
      const headers = getHeaders(jwt);
      const res = await fetch(`${BASE_STRAPI_URL}/api/tickets?filters[holderAddress][$eq]=${holderAddress.toLowerCase()}&filters[event][id][$eq]=${eventId}${noLimitPagination}&populate=ticket`, { headers });
      return res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static async assignHolderAddressToTicket(jwt: string, ticketId: number, holderAddress: string): Promise<void> {
    try {
      const headers = getHeaders(jwt);
      const res = await fetch(`${BASE_STRAPI_URL}/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data: { holderAddress: holderAddress.toLowerCase() } })
      });
      return res.json();
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
