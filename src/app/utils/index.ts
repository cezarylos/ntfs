import { StrapiService } from '@/app/services/strapi.service';
import { ChainsEnum, ChainsIdsEnum } from '@/app/typings/chains.enum';
import { SocialLinksEnum } from '@/app/typings/common.typings';
import { EventInterface } from '@/app/typings/event.interface';

export const formatAddress = (addr: string) => {
  return `${addr.substring(0, 8)}...`;
};

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const shuffleArray = (array: any[]): any[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getMaticProvider = (chainId: number): string => {
  return chainId === ChainsIdsEnum['0x89'] ? polygonRPC : mumbaiRPC;
};

export const getChainIdFromString = (chainString: string): string | number => {
  if (!chainString) {
    console.error('No chainId provided');
    return '';
  }

  const input = chainString;
  const regex = /\[\w+\]:\s(0x[a-fA-F0-9]+)/;
  const match = input.match(regex);

  if (match) {
    return ChainsIdsEnum[match[1] as any];
  }
  return chainString;
};

export const createOpenSeaLink = ({
  contractAddress,
  tokenId,
  chainId
}: {
  contractAddress: string;
  tokenId: number;
  chainId: string;
}): string => {
  const testnetPrefix = chainId === ChainsEnum.MUMBAI ? 'testnets.' : '';
  const chainName = chainId === ChainsEnum.MUMBAI ? 'mumbai' : 'matic';
  return `https://${testnetPrefix}opensea.io/assets/${chainName}/${contractAddress}/${tokenId}`;
};

export function classNames(...classes: Array<string | undefined | boolean>): string {
  return classes.filter(Boolean).join(' ');
}

export const getEventBySlug = async (
  slug: string,
  fields?: string[],
  hasCollectionImage = false
): Promise<EventInterface> => {
  const eventResponse = await StrapiService.getEventBySlug(slug, fields, hasCollectionImage);
  let collectionImage = null;
  if (hasCollectionImage) {
    collectionImage = eventResponse.data[0]?.attributes.collectionImage.data.attributes.url;
  }
  return { ...eventResponse.data[0].attributes, id: eventResponse.data[0].id, collectionImage };
};

export const replaceS3LinkWithCloudFront = (url: string) => {
  const regex = /https:\/\/[^/]+\.s3\.eu-north-1\.amazonaws\.com(\/.*)$/;
  if (regex.test(url) && process.env.NEXT_PUBLIC_CLOUDFRONT_URL && process.env.NODE_ENV === 'production') {
    return url.replace(regex, `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}$1`);
  }
  return url;
};

export const getSocialIcon = (socialLink: SocialLinksEnum): string => {
  switch (socialLink) {
    case SocialLinksEnum.INSTAGRAM:
      return '/instagram-logo.svg';
    case SocialLinksEnum.FACEBOOK:
      return '/fb-logo.svg';
    case SocialLinksEnum.DISCORD:
      return '/discord-logo.svg';
    default:
      return '';
  }
};

export const getTokenWord = (amount: number): string => {
  switch (amount) {
    case 1:
      return 'token';
    case 2:
    case 3:
    case 4:
      return 'tokeny';
    default:
      return 'tokenów';
  }
};

export const getLeftWord = (amount: number): string => {
  switch (amount) {
    case 1:
      return 'Pozostał';
    case 2:
    case 3:
    case 4:
      return 'Pozostały';
    default:
      return 'Pozostało';
  }
};

export const polygonRPC = 'https://polygon-rpc.com';
export const mumbaiRPC = 'https://rpc-mumbai.maticvigil.com';
// export const polygonRPC = 'https://rpc-mainnet.maticvigil.com';

export const checkIfImageIsGift = (imageUrl: string): boolean => /\.gif$/i.test(imageUrl);
