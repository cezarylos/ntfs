import { EventInterface } from '@/app/typings/event.interface';
import { StrapiResponseInterface } from '@/app/typings/strapiResponse.interface';

const baseUrl = 'http://localhost:1337/api';

export class StrapiService {
  public static async getEvents(): Promise<StrapiResponseInterface<EventInterface[]>> {
    try {
      const res =  await fetch(`${baseUrl}/events`);
      return res.json();
    } catch (e) {
      console.error(e);
    }
  }

  public static async getEvent(eventId: number): Promise<StrapiResponseInterface<EventInterface>> {
    try {
      const res =  await fetch(`${baseUrl}/events/${eventId}`);
      return res.json();
    } catch (e) {
      console.error(e);
    }
  }
}
