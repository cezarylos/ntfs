import { StrapiService } from '@/app/services/strapi.service';
import { getMaticProvider } from '@/app/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { address, eventId } = req.body;
    if (!address || !eventId) {
      return res.status(400).json({ message: 'Address and event ID are required' });
    }
    try {
      const [holderTicketResponse, eventResponse] = await Promise.all([
        StrapiService.getTicketsByHolderAddress(process.env.STRAPI_API_TOKEN as string, address.toLowerCase()),
        StrapiService.getEventById(eventId, [
          'contractAddress',
          'ABI',
          'chainId',
          'amountOfTokensToGetReward',
          'excludedAddressesFromRewards'
        ])
      ]);

      const {
        meta: {
          pagination: { total }
        }
      } = holderTicketResponse;
      const { contractAddress, ABI, chainId, amountOfTokensToGetReward, excludedAddressesFromRewards } =
        eventResponse.data.attributes;

      if (total > 0) {
        return res.status(201).json({ message: 'Ticket already assigned' });
      }

      if (excludedAddressesFromRewards.includes(address)) {
        return res.status(400).json({ message: 'Address is excluded from rewards' });
      }

      const providerUrl = getMaticProvider(chainId);
      const web3 = new Web3(providerUrl);
      const contract = new web3.eth.Contract(ABI, contractAddress);

      const tokensIds =
        (await contract.methods.getTokensByOwner?.(address).call())?.map((tokenId: string) => Number(tokenId)) || [];

      const tokensCount = tokensIds.length;

      if (tokensCount < amountOfTokensToGetReward) {
        return res.status(400).json({ message: `Not enough tokens. Has ${tokensCount}/${amountOfTokensToGetReward}.` });
      }

      const emptyTicketsResponse = await StrapiService.getTicketsWithoutHolderAddress(
        process.env.STRAPI_API_TOKEN as string
      );

      if (emptyTicketsResponse.data.length === 0) {
        return res.status(400).json({ message: 'No tickets available' });
      }

      const emptyTicketId = emptyTicketsResponse.data[0].id;
      await StrapiService.assignHolderAddressToTicket(
        process.env.STRAPI_API_TOKEN as string,
        emptyTicketId,
        address.toLowerCase()
      );

      return res.status(201).json({ message: 'Ticket assigned' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
