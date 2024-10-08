import { StrapiService } from '@/app/services/strapi.service';
import { TicketInterface } from '@/app/typings/ticket.interface';
import { replaceS3LinkWithCloudFront } from '@/app/utils';
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
        const response = await StrapiService.getTicketsByHolderAddress(
          process.env.STRAPI_API_TOKEN as string,
          address,
          eventId
        );
        const { data } = response;

        if (!data) {
          return res.status(400).json({ message: 'No rewards' });
        }

        const tickets = (
          await Promise.all(
            data.map(async ticketWrapper => {
              const {
                attributes: { title, description, isRewardCollected }
              } = ticketWrapper;
              const res = {
                title,
                description,
                isRewardCollected
              } as TicketInterface;
              const ticketUrl = ticketWrapper.attributes.ticket?.data?.attributes.url;
              res.url = ticketUrl ? replaceS3LinkWithCloudFront(ticketUrl) : '';
              return res;
            })
          )
        ).sort((a: TicketInterface | undefined, b: TicketInterface | undefined): number => {
          if (a?.event && b?.event) {
            return +a.event.id - +b.event.id;
          }
          return 0;
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
