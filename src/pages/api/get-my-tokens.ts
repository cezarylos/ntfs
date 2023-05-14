import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import { StrapiService } from '@/app/services/strapi.service';

const ipfsGateways = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://ipfs.fleek.co/ipfs/',
  'https://ipfs.infura.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/'
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { eventId, providerUrl, address } = req.query as {
      contractAddress: string;
      providerUrl: string;
      address: string;
    };
    try {
      const web3 = new Web3(providerUrl);

      const eventResponse = await StrapiService.getEventById(eventId, ['contractAddress', 'ABI']);
      const { contractAddress, ABI } = eventResponse.data.attributes;

      const contract = new web3.eth.Contract(ABI, contractAddress);

      const myTokenIds = await contract.methods.getTokensByOwner?.(address).call();

      const tokens = await Promise.all(myTokenIds.map(async (token: string) => {
        const link = (await contract.methods.tokenURI(token).call()).split('ipfs://')[1];
        const res = await fetch(`${ipfsGateways[0]}${link}`);
        return res.json();
      }));

      const mappedTokens = tokens.map((token: any) => ({
        ...token,
        image: `${ipfsGateways[0]}${token.image.split('ipfs://')[1]}`
      }));

      return res.status(200).json(mappedTokens);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
