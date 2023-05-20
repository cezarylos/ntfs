'use client';

// this is a client component 👈🏽
import Checkout from '@/app/components/checkout';
import MetaMaskLinks from '@/app/components/metamaskLinks';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { EventInterface } from '@/app/typings/event.interface';
import { getChainIdFromString, getMaticProvider } from '@/app/utils';
import { marked } from 'marked';
import Link from 'next/link';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import axios from 'axios';
import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useSwitchChain } from '@/app/hooks/useSwitchChain';

export default function Event({ id, winterProjectId, chainId }: EventInterface): ReactElement {
  const [myTokens, setMyTokens] = useState([]);
  const [address, setAddress] = useState(null);
  const [isBuyPanelOpen, setIsBuyPanelOpen] = useState(false);
  const [tokensLeft, setTokensLeft] = useState(0);
  const [isTokensLoading, setIsTokensLoading] = useState(false);

  const eventChainId = useMemo((): string => getChainIdFromString(chainId), [chainId]);
  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);

  const switchChain = useSwitchChain(eventChainId);


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
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      setAddress(currentAccount);
      const providerUrl = getMaticProvider(eventChainId);

      const myTokensResponse = await axios.get(`/api/${EndpointsEnum.GET_MY_TOKENS}`, {
        params: {
          providerUrl,
          address: currentAccount,
          eventId: id
        }
      });

      setMyTokens(myTokensResponse.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTokensLoading(false);
    }
  }, [switchChain, eventChainId, id]);

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
    if (isCurrentChainIdSameAsEventChainId) {
      Promise.all([getMyTokens(), getTokensLeft()]).finally();
    }
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
                        __html: marked.parse(token.description).replace('<a ', '<a target="_blank" ')
                      }}
                    />
                    <div>{token.tokenId}</div>
                    <p>
                      <a href={token.openseaUrl} target='_blank'>
                        View on OpenSea
                      </a>
                    </p>
                    <img style={{ width: '100px' }} src={token.image} alt={token.name}/>
                  </div>
                );
              })
            ) : (
              <p>{`You don't have any tokens yet`}</p>
            )}
          </div>
          <br/>
          <br/>
          <br/>
          {tokensLeft ? (
              <button onClick={openWidget}>
                <h1>BUY THIS FUCKER</h1>
              </button>
            ) :
            <p>NO TOKENS LEFT, SORRY, TRY ANOTHER EVENT</p>
          }
          <br/>
          <Link href={`event/${id}/result`}>
            <button>
              <h3>Check for tickets</h3>
            </button>
          </Link>
          <br/>
        </>
      ) : (
        <>
          <p>Log in to MetaMask to interact with tokens</p>
          <MetaMaskLinks/>
        </>
      )}
    </>
  );
}
