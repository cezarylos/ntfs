import { SocialLinksEnum } from '@/app/typings/common.typings';

export interface EventInterface {
  contractAddress: string;
  checkoutProjectId: string;
  ABI: Array<Record<string, any>>;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  picture: any;
  id: any;
  chainId: string;
  slug: string;
  collectionImage: any;
  amountOfTokensToGetReward: number;
  excludedAddressesFromRewards: string[];
  socialLinks: Record<SocialLinksEnum, string>;
  rewardTitle: string;
  giveawayStartDate: string;
}
