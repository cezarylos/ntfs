import { BASE_STRAPI_URL, StrapiService } from '@/app/services/strapi.service';
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
        const response = await StrapiService.getTicketsByEventIdAndHolderAddress(
          process.env.STRAPI_API_TOKEN,
          eventId,
          address
        );
        const { data } = response;

        const tickets = await Promise.all(
          data.map(async ticketWrapper => {
            const { url } = ticketWrapper.attributes.ticket.data.attributes;
            return {
              url: `${BASE_STRAPI_URL}${url}`
            };
          })
        );

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
