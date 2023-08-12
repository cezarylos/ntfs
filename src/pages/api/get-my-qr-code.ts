import { StrapiService } from '@/app/services/strapi.service';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { NextApiRequest, NextApiResponse } from 'next';

const CryptoJS = require('crypto-js');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { address, message, signature } = req.body;
    try {
      const recoveredAddress = recoverPersonalSignature({
        signature,
        data: message
      });

      if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        const {
          data: {
            attributes: { key }
          }
        } = await StrapiService.getEncryptionKey(process.env.STRAPI_API_TOKEN as string);

        const encryptedAddress = CryptoJS.AES.encrypt(address, key as string).toString();

        return res.status(201).json(encryptedAddress);
      } else {
        return res.status(400).json({ message: 'Unauthorized' });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
