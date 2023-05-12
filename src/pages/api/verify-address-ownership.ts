import { NextApiRequest, NextApiResponse } from 'next';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { address, message, signature } = req.body;
    try {
      const recoveredAddress = recoverPersonalSignature({
        signature,
        data: message,
      });

      if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        return res.status(201).json({})
      } else {
        return res.status(400).json({ message: 'Unauthorized' })
      }
    } catch (e) {
      return res.status(500).json({ message: 'Something went wrong' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
