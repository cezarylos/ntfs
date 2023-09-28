import { StrapiService } from '@/app/services/strapi.service';
import { getChainIdFromString, getMaticProvider } from '@/app/utils';
import { BN } from 'bn.js';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { eventId, address, amount } = req.query as {
      eventId: string;
      providerUrl: string;
      address: string;
      amount: string;
    };
    try {
      const amountToMint = Number(amount || 1);

      const eventResponse = await StrapiService.getEventById(eventId, ['contractAddress', 'ABI', 'chainId']);
      const { contractAddress, ABI, chainId } = eventResponse.data.attributes;

      const eventChainId = getChainIdFromString(chainId);
      const providerUrl = getMaticProvider(eventChainId);
      const web3 = new Web3(providerUrl);

      const contract = new web3.eth.Contract(ABI, contractAddress);

      const price = (await contract.methods.getPrice(amountToMint).call()) as number;

      const transactionParameters = {
        to: contractAddress,
        from: address,
        value: price.toString(),
        abi: ABI
      };

      return res.status(200).json({
        transactionParameters,
        price: price.toString()
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
