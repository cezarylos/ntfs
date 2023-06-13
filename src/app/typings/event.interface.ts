import { SocialLinksEnum } from '@/app/typings/common.typings';

export interface EventInterface {
  contractAddress: string;
  winterProjectId: string;
  ABI: Array<Record<string, any>>;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  picture: any;
  id: any;
  chainId: string;
  slug: string;
  collectionImage: any;
  amountOfTokensToGetReward: number;
  excludedAddressesFromRewards: string[];
  socialLinks: Record<SocialLinksEnum, string>;
  rewardTitle: string;
  giveawayStartDate: Date;
}
