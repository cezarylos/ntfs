'use client';

import { ThirdwebNftMedia, useContract, useNFT } from '@thirdweb-dev/react';
import React, { Dispatch, ReactElement, useEffect } from 'react';

interface Props {
  contractAddress: string;
  tokenId: string;
  style?: Record<string, string>;
  className?: string;
  setMetadata?: Dispatch<Record<string, any>>;
}

export default function NftMedia({ contractAddress, tokenId, style, className, setMetadata }: Props): ReactElement {
  const { contract } = useContract(contractAddress);
  const { data: nft, isLoading, error } = useNFT(contract, tokenId);

  useEffect((): void => {
    if (nft?.metadata) {
      setMetadata?.(nft.metadata);
    }
  }, [nft, setMetadata]);

  if (isLoading || error || !nft)
    return (
      <div className="w-full h-40 flex items-center justify-center rounded-2xl bg-cyan-100/50">
        {isLoading && <span className="animate-pulse text-white text-lg">Ładowanie...</span>}
        {!isLoading && (error || !nft) && <span className="text-white text-lg">Błąd</span>}
      </div>
    );

  return <ThirdwebNftMedia metadata={nft.metadata} className={className} style={style} />;
}
