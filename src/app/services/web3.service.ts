import { ChainsEnum } from '@/app/typings/chains.enum';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { getMaticProvider } from '@/app/utils';

import axios from 'axios';

export class Web3Service {
  static async getTokensLeft({
    eventChainId,
    eventId
  }: {
    eventChainId: ChainsEnum | string;
    eventId: any;
  }): Promise<{ tokensLeft: number; maxSupply: number } | void> {
    const providerUrl = getMaticProvider(eventChainId);
    try {
      const response = await axios.get(
        `/api/${EndpointsEnum.GET_TOKENS_AMOUNT_LEFT}/${eventId}?providerUrl=${providerUrl}`
      );
      const { tokensLeft, maxSupply } = response.data;
      return {
        tokensLeft: parseInt(tokensLeft),
        maxSupply: parseInt(maxSupply)
      };
    } catch (e) {
      console.error(e);
    }
  }
}
