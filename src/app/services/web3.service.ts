import { EndpointsEnum } from '@/app/typings/endpoints.enum';

export class Web3Service {
  static async getTokensLeft({ eventId }: { eventId: any }): Promise<{ tokensLeft: number; maxSupply: number } | void> {
    try {
      const response = await fetch(`/api/${EndpointsEnum.GET_TOKENS_AMOUNT_LEFT}/${eventId}`, {
        next: { revalidate: 60 }
      });
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
