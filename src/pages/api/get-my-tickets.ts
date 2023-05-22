import { StrapiService } from '@/app/services/strapi.service';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { address, message, signature, eventId } = req.body;
    try {
      const recoveredAddress = recoverPersonalSignature({
        signature,
        data: message
      });

      if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        const response = await StrapiService.getTicketsByHolderAddress(process.env.STRAPI_API_TOKEN, address, eventId);
        const { data } = response;

        const tickets = (
          await Promise.all(
            data.map(async ticketWrapper => {
              const res = {} as { url: string; event?: { name: string; id: number } };
              if (!eventId) {
                const { attributes, id } = ticketWrapper.attributes.event?.data || {};
                res.event = { ...attributes, id };
              }
              res.url = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${ticketWrapper.attributes.ticket.data.attributes.url}`;
              return res;
            })
          )
        ).sort((a, b) => {
          if (a.event && b.event) {
            return +a.event.id - +b.event.id;
          }
        });

        return res.status(201).json(tickets);
      } else {
        return res.status(400).json({ message: 'Unauthorized' });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
