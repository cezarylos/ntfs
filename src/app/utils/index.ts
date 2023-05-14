import detectEthereumProvider from '@metamask/detect-provider';

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
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const shuffleArray = (array: any[]): any[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getMaticProvider = async (window: Window): Promise<string | null> => {
  if (!window?.ethereum) {
    return null;
  }
  const provider = await detectEthereumProvider();
  const chainId = await provider.request({ method: 'eth_chainId' });
  return chainId === '0x89' ? 'https://rpc-mainnet.matic.network' : 'https://rpc-mumbai.maticvigil.com';
}
