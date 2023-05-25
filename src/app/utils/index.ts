import { StrapiService } from '@/app/services/strapi.service';
import { Web3Service } from '@/app/services/web3.service';
import { ChainsEnum } from '@/app/typings/chains.enum';
import { EventInterface } from '@/app/typings/event.interface';

export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

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

export const getMaticProvider = (chainId: string): string => {
  return chainId === '0x89' ? 'https://rpc-mainnet.matic.network' : 'https://rpc-mumbai.maticvigil.com';
};

export const getChainIdFromString = (chainString: string): string => {
  if (!chainString) {
    console.error('No chainId provided');
    return '';
  }
  const input = chainString;
  const regex = /\[\w+\]:\s(0x[a-fA-F0-9]+)/;
  const match = input.match(regex);

  if (match) {
    return match[1];
  }
  return '';
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

export const connectMetamaskMobile = (): void => {
  const dappUrl = window.location.href.split('//')[1];
  const metamaskAppDeepLink = 'https://metamask.app.link/dapp/' + dappUrl;
  window.open(metamaskAppDeepLink, '_self');
};

export const getEventBySlug = async (
  slug: string,
  fields: string[],
  hasCollectionImage = false
): Promise<EventInterface> => {
  const eventResponse = await StrapiService.getEventBySlug(slug, fields, hasCollectionImage);
  let collectionImage = null;
  if (hasCollectionImage) {
    collectionImage = eventResponse.data[0].attributes.collectionImage.data.attributes.url;
  }
  return { ...eventResponse.data[0].attributes, id: eventResponse.data[0].id, collectionImage };
};
