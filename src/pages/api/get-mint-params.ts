import { StrapiService } from '@/app/services/strapi.service';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import { toBigInt } from 'web3-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { eventId, providerUrl, address } = req.query as { eventId: string; providerUrl: string; address: string };
    try {
      const web3 = new Web3(providerUrl);

      const eventResponse = await StrapiService.getEventById(eventId, ['contractAddress', 'ABI', 'chainId']);
      const { contractAddress, ABI } = eventResponse.data.attributes;

      const contract = new web3.eth.Contract(ABI, contractAddress);

      const transactionParameters = {
        to: contractAddress,
        from: address,
        data: contract.methods.mint(address, 1).encodeABI()
      };

      const price = await contract.methods.getPrice(1).call();

      return res.status(200).json({
        transactionParameters,
        price: Number(toBigInt(price)) / 10 ** 18
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
