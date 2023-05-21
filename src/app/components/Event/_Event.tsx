'use client';

// this is a client component 👈🏽
import Checkout from '@/app/components/checkout';
import MetaMaskLinks from '@/app/components/metamaskLinks';
import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useSwitchChain } from '@/app/hooks/useSwitchChain';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { EventInterface } from '@/app/typings/event.interface';
import { getChainIdFromString, getMaticProvider } from '@/app/utils';
import { marked } from 'marked';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import axios from 'axios';

export default function Event({ id, winterProjectId, chainId, picture }: EventInterface): ReactElement {
  const { wallet } = useMetaMask();
  const [myTokens, setMyTokens] = useState([]);
  const [isBuyPanelOpen, setIsBuyPanelOpen] = useState(false);
  const [tokensLeft, setTokensLeft] = useState(0);
  const [isTokensLoading, setIsTokensLoading] = useState(false);

  const eventChainId = useMemo((): string => getChainIdFromString(chainId), [chainId]);
  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);

  const switchChain = useSwitchChain(eventChainId);

  const address = useMemo((): string => wallet.accounts?.[0], [wallet.accounts]);

  const toggleBuyPanel = useCallback((): void => {
    setIsBuyPanelOpen(!isBuyPanelOpen);
  }, [isBuyPanelOpen]);

  const addEventNetwork = useCallback(async (): Promise<void> => {
    if (!window?.ethereum) {
      return;
    }
    try {
      if (isCurrentChainIdSameAsEventChainId) {
        return;
      }
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: eventChainId,
            rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
            chainName: 'Mumbai Testnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18
            },
            blockExplorerUrls: ['https://polygonscan.com/']
          }
        ]
      });
    } catch (error) {
      console.log(error);
    }
  }, [eventChainId, isCurrentChainIdSameAsEventChainId]);

  const getMyTokens = useCallback(async () => {
    try {
      setIsTokensLoading(true);
      await switchChain();
      const providerUrl = getMaticProvider(eventChainId);

      const myTokensResponse = await axios.get(`/api/${EndpointsEnum.GET_MY_TOKENS}`, {
        params: {
          providerUrl,
          address,
          eventId: id
        }
      });

      setMyTokens(myTokensResponse.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTokensLoading(false);
    }
  }, [switchChain, eventChainId, id, address]);

  const getTokensLeft = useCallback(async () => {
    const providerUrl = getMaticProvider(eventChainId);
    try {
      const response = await axios.get(`/api/${EndpointsEnum.GET_TOKENS_AMOUNT_LEFT}/${id}`, {
        params: {
          providerUrl
        }
      });
      setTokensLeft(response.data.tokensLeft);
    } catch (e) {
      console.error(e);
    }
  }, [eventChainId, id]);

  const onSuccess = useCallback(async (): Promise<void> => {
    toggleBuyPanel();
    await Promise.all([getMyTokens(), getTokensLeft()]);
  }, [getMyTokens, getTokensLeft, toggleBuyPanel]);

  useEffect((): void => {
    addEventNetwork().finally();
  }, [addEventNetwork]);

  useEffect((): void => {
    const calls = [getTokensLeft()];
    if (isCurrentChainIdSameAsEventChainId) {
      calls.push(getMyTokens());
    }
    Promise.all(calls).finally();
  }, [getMyTokens, getTokensLeft, isCurrentChainIdSameAsEventChainId]);

  const openWidget = useCallback(async (): Promise<void> => {
    try {
      await switchChain();
      toggleBuyPanel();
    } catch (e) {
      console.error(e);
    }
  }, [switchChain, toggleBuyPanel]);

  return (
    <>
      {address && isCurrentChainIdSameAsEventChainId && (
        <Checkout
          address={address}
          projectId={winterProjectId}
          isBuyPanelOpen={isBuyPanelOpen}
          setIsBuyPanelOpen={setIsBuyPanelOpen}
          onSuccess={onSuccess}
        />
      )}
      <div className="relative w-full h-auto rounded-md overflow-clip">
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${picture?.data.attributes.url}`}
          width={0}
          height={0}
          alt={'tło'}
          fill={false}
          priority
          sizes={'100vw'}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <h1>Tokens left: {tokensLeft}</h1>
      {isCurrentChainIdSameAsEventChainId ? (
        <>
          <div>
            <h2>MY TOKENS:</h2>
            {isTokensLoading && <p>Loading...</p>}
            {myTokens?.length ? (
              myTokens.map((token: any, id: number) => {
                return (
                  <div key={`${token.tokenId}_${id}`} style={{ marginBottom: '24px' }}>
                    <div>{token.name}</div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: marked
                          .parse(token.description, { mangle: false, headerIds: false })
                          .replace('<a ', '<a target="_blank" ')
                      }}
                    />
                    <div>{token.tokenId}</div>
                    <p>
                      <a href={token.openseaUrl} target="_blank">
                        View on OpenSea
                      </a>
                    </p>
                    <img style={{ width: '100px' }} src={token.image} alt={token.name} />
                  </div>
                );
              })
            ) : (
              <p>{`You don't have any tokens yet`}</p>
            )}
          </div>
          <br />
          <br />
          <br />
        </>
      ) : (
        <>
          <p>Log in to MetaMask to interact with tokens</p>
          <MetaMaskLinks />
        </>
      )}
      {tokensLeft ? (
        <button onClick={openWidget}>
          <h1>BUY THIS FUCKER</h1>
        </button>
      ) : (
        <p>NO TOKENS LEFT, SORRY, TRY ANOTHER EVENT</p>
      )}
      <br />
      <Link href={`app/event/${id}/result`}>
        <button>
          <h3>Check for tickets</h3>
        </button>
      </Link>
      <br />
    </>
  );
}
