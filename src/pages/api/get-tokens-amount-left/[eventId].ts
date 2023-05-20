import { StrapiService } from '@/app/services/strapi.service';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { eventId, providerUrl } = req.query as { eventId: string; providerUrl: string };
    try {
      const web3 = new Web3(providerUrl);
      const eventResponse = await StrapiService.getEventById(eventId, ['contractAddress', 'ABI', 'name']);
      const { contractAddress, ABI } = eventResponse.data.attributes;
      const contract = new web3.eth.Contract(ABI, contractAddress);

      const [totalSupply, MAX_TOKENS] = await Promise.all([
        contract.methods.totalSupply().call(),
        contract.methods.MAX_TOKENS().call()
      ]);
      const tokensLeft = MAX_TOKENS - totalSupply;

      return res.status(200).json({ tokensLeft });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
