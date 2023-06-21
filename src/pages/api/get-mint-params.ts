import { StrapiService } from '@/app/services/strapi.service';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import { toBigInt } from 'web3-utils';
import { BN } from 'bn.js';
import { getChainIdFromString, getMaticProvider } from '@/app/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { eventId, address } = req.query as { eventId: string; providerUrl: string; address: string };
    try {
      const eventResponse = await StrapiService.getEventById(eventId, ['contractAddress', 'ABI', 'chainId']);
      const { contractAddress, ABI, chainId } = eventResponse.data.attributes;

      const eventChainId = getChainIdFromString(chainId)
      const providerUrl = getMaticProvider(eventChainId);
      const web3 = new Web3(providerUrl);

      const contract = new web3.eth.Contract(ABI, contractAddress);

      const price = await contract.methods.getPrice(1).call() as number;
      const valueInWei = new BN(price);
      const valueInHex = '0x' + price.toString(16);
      const valueInEther = valueInWei.div(new BN('1000000000000000000'));

      const transactionParameters = {
        to: contractAddress,
        from: address,
        value: valueInHex,
        data: contract.methods.mint(address, 1).encodeABI(),
      };

      return res.status(200).json({
        transactionParameters,
        price: valueInEther.toString()
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
