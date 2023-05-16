import { NextApiRequest, NextApiResponse } from 'next';
import { StrapiService } from '@/app/services/strapi.service';
import { TicketInterface } from '@/app/typings/ticket.interface';
import { shuffleArray } from '@/app/utils';
import Web3 from 'web3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { eventId, providerUrl, jwt } = req.query as { eventId: string; providerUrl: string; jwt: string };

    try {
      const web3 = new Web3(providerUrl);
      const eventResponse = await StrapiService.getEventById(eventId, ['contractAddress', 'ABI', 'eventName']);
      const { contractAddress, ABI, eventName } = eventResponse.data.attributes;
      const contract = new web3.eth.Contract(ABI, contractAddress);

      const [tickets, totalSupply] = await Promise.all([
        StrapiService.getTicketsByEventId(jwt, eventId),
        contract.methods.totalSupply().call()
      ]);

      const holders = [];
      for (let i = 1; i <= totalSupply; i++) {
        const ownerAddress = await contract.methods.ownerOf(i).call();
        holders.push(ownerAddress);
      }

      const mappedTickets = tickets.data.map(({ id, attributes }: {
        id: number;
        attributes: TicketInterface
      }) => ({ id, ...attributes }));

      const shuffledHolders = shuffleArray(holders);

      await Promise.all(mappedTickets.map(async (ticket: TicketInterface, index: number) => {
        if (ticket.holderAddress) {
          return;
        }
        if (shuffledHolders[index]) {
          StrapiService.assignHolderAddressToTicket(jwt, ticket.id, shuffledHolders[index]).finally();
        }
      }));

      return res.status(200).json({ message: `${eventName}: Lottery finished!` });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
