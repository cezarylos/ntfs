import { StrapiService } from '@/app/services/strapi.service';
import { getChainIdFromString, getMaticProvider } from '@/app/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { eventId } = req.query as { eventId: string };
    try {
      const eventResponse = await StrapiService.getEventById(eventId, ['contractAddress', 'ABI', 'name', 'chainId']);
      const { contractAddress, ABI, chainId } = eventResponse.data.attributes;
      const eventChainId = getChainIdFromString(chainId) as number;
      const providerUrl = getMaticProvider(eventChainId);
      const web3 = new Web3(providerUrl);

      const contract = new web3.eth.Contract(ABI, contractAddress);

      const [totalSupply, MAX_TOKENS] = await Promise.all([
        contract.methods.totalSupply().call(),
        contract.methods.MAX_TOKENS().call()
      ]);

      const tokensLeft = Number(MAX_TOKENS) - Number(totalSupply);

      return res.status(200).json({ tokensLeft, maxSupply: Number(MAX_TOKENS) });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
