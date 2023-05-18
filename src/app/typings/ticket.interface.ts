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
}
