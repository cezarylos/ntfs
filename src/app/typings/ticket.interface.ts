import { EventInterface } from '@/app/typings/event.interface';
import { StrapiResponseInterface } from '@/app/typings/strapiResponse.interface';

export interface TicketInterface {
  holderAddress: string;
  id: number;
  ticket: {
    data: {
      attributes: {
        name: string;
        url: string;
        mime: string;
      };
    };
  };
  event?: StrapiResponseInterface<EventInterface>;
  url: string;
  title: string;
  description: string;
  tokenIds: number[];
}
