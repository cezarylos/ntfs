import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import ABI from './ABI.json';

const MAX_TOKENS = 2;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { contractAddress, providerUrl, address } = req.query as { contractAddress: string; providerUrl: string; address: string; };
    try {
      const holders = [];
      const web3 = new Web3(providerUrl);

      const contract = new web3.eth.Contract(ABI, contractAddress);

      // get the total number of tokens minted by the contract
      const totalSupply = await contract.methods.totalSupply().call();

      // iterate over each token and get its owner's address
      for (let i = 1; i <= totalSupply; i++) {
        const ownerAddress = await contract.methods.ownerOf(i).call();
        holders.push(ownerAddress);
        console.log(`Token ${i} owner: ${ownerAddress}`);
      }

      const isHolder = holders.find(holderAddress => holderAddress.toLowerCase() === address.toLowerCase());

      if (isHolder) {
        return res.status(200).json({ message: 'Success! Token has been found in your wallet'});
      }

      return res.status(401).json({ message: 'Token not found in your wallet'});
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
