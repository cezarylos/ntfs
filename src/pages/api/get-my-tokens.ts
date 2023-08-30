import { StrapiService } from '@/app/services/strapi.service';
import { createOpenSeaLink, getChainIdFromString, getMaticProvider } from '@/app/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { eventId, address } = req.query as { eventId: string; providerUrl: string; address: string };
    try {
      const eventResponse = await StrapiService.getEventById(eventId, ['contractAddress', 'ABI', 'chainId']);
      const { contractAddress, ABI, chainId } = eventResponse.data.attributes;
      const providerUrl = getMaticProvider(getChainIdFromString(chainId));

      const web3 = new Web3(providerUrl);

      const contract = new web3.eth.Contract(ABI, contractAddress);

      const myTokenIds = (await contract.methods.getTokensByOwner?.(address).call())?.map((tokenId: string) =>
        Number(tokenId)
      );

      const mappedTokens = myTokenIds?.map(id => {
        const openseaUrl = createOpenSeaLink({
          contractAddress,
          tokenId: id,
          chainId: getChainIdFromString(chainId)
        });
        return { id, openseaUrl };
      });

      return res.status(200).json(mappedTokens);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
