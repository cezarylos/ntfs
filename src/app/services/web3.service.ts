import { ChainsEnum } from '@/app/typings/chains.enum';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { getMaticProvider } from '@/app/utils';

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
      const response = await fetch(
        `/api/${EndpointsEnum.GET_TOKENS_AMOUNT_LEFT}/${eventId}?providerUrl=${providerUrl}`,
        { next: { revalidate: 60 } }
      );
      const { tokensLeft, maxSupply } = await response.json();
      return {
        tokensLeft: parseInt(tokensLeft),
        maxSupply: parseInt(maxSupply)
      };
    } catch (e) {
      console.error(e);
    }
  }
}
