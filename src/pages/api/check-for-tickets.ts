import { NextApiRequest, NextApiResponse } from 'next';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { BASE_STRAPI_URL, StrapiService } from '@/app/services/strapi.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { address, message, signature, eventId } = req.body;
    try {
      const recoveredAddress = recoverPersonalSignature({
        signature,
        data: message
      });

      if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        const response = await StrapiService.getTicketsByEventIdAndHolderAddress(process.env.STRAPI_API_TOKEN, eventId, address);
        const { data } = response;

        const tickets = await Promise.all(data.map(async ticketWrapper => {
          const { url, mime } = ticketWrapper.attributes.ticket.data.attributes;
          const response = await fetch(`${BASE_STRAPI_URL}${url}`, {
            headers: {
              Accept: 'application/octet-stream'
            }
          });

          if (!response.ok) {
            throw new Error(`File retrieval failed for URL: ${url}`);
          }

          const fileData = await response.arrayBuffer();
          const fileBlob = new Blob([fileData], { type: mime });

          return {
            name: url.split('/').pop(),
            data: URL.createObjectURL(fileBlob)
          };
        }));

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
