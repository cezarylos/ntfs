'use client'; // this is a client component 👈🏽

import { EventInterface } from '@/app/typings/event.interface';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { marked } from 'marked';
import Checkout from '@/app/components/checkout';
import { getChainIdFromString, getMaticProvider } from '@/app/utils';
import Link from 'next/link';
import { useMetaMask } from '@/app/hooks/useMetaMask';
import MetaMaskLinks from '@/app/components/metamaskLinks';
import { ChainsEnum } from '@/app/typings/chains.enum';

export default function Event({ id, winterProjectId, chainId }: EventInterface): ReactElement {
  const { hasProvider } = useMetaMask();
  const [myTokens, setMyTokens] = useState([]);
  const [address, setAddress] = useState(null);
  const [isBuyPanelOpen, setIsBuyPanelOpen] = useState(false);
  const [tokensLeft, setTokensLeft] = useState(0);
  const [isTokensLoading, setIsTokensLoading] = useState(false);

  const toggleBuyPanel = useCallback((): void => {
    setIsBuyPanelOpen(!isBuyPanelOpen);
  }, [isBuyPanelOpen]);

  const addMumbaiNetwork = useCallback(async (): Promise<void> => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId === ChainsEnum.MUMBAI) {
        return;
      }
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: ChainsEnum.MUMBAI, //todo - change in prod
          rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
          chainName: 'Mumbai Testnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          blockExplorerUrls: ['https://polygonscan.com/']
        }]
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getMyTokens = useCallback(async () => {
    try {
      setIsTokensLoading(true);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: getChainIdFromString(chainId) }]
      });
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      setAddress(currentAccount);
      const providerUrl = await getMaticProvider(window);

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
  }, [chainId, id]);

  const getTokensLeft = useCallback(async () => {
    const providerUrl = await getMaticProvider(window);
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
  }, [id]);

  const onSuccess = useCallback(async (): Promise<void> => {
    toggleBuyPanel();
    await Promise.all([getMyTokens(), getTokensLeft()]);
  }, [getMyTokens, getTokensLeft, toggleBuyPanel]);

  useEffect(() => {
    if (!window?.ethereum) {
      return;
    }
    const init = async () => {
      await addMumbaiNetwork();
      await Promise.all([getMyTokens(), getTokensLeft()]);
    };
    init().finally();
  }, [getMyTokens, getTokensLeft, hasProvider, addMumbaiNetwork]);

  const openWidget = useCallback(async (): Promise<void> => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: getChainIdFromString(chainId) }]
    });
    toggleBuyPanel();
  }, [toggleBuyPanel, chainId]);

  return <>
    {address && <Checkout
        address={address}
        projectId={winterProjectId}
        isBuyPanelOpen={isBuyPanelOpen}
        setIsBuyPanelOpen={setIsBuyPanelOpen}
        onSuccess={onSuccess}
    />}
    {hasProvider ?
      <>
        <h1>Tokens left: {tokensLeft}</h1>
        <div>
          <h2>MY TOKENS:</h2>
          {isTokensLoading && <p>Loading...</p>}
          {myTokens?.length ? myTokens.map((token: any, id: number) => {
              return <div key={`${token.tokenId}_${id}`} style={{ marginBottom: '24px' }}>
                <div>{token.name}</div>
                <div
                  dangerouslySetInnerHTML={{ __html: marked.parse(token.description).replace('<a ', '<a target="_blank" ') }}/>
                <div>{token.tokenId}</div>
                <img style={{ width: '100px' }} src={token.image} alt={token.name}/>
              </div>;
            }) :
            <p>{`You don't have any tokens yet`}</p>
          }
        </div>
        <br/>
        <br/>
        <br/>
        {!!tokensLeft && <button onClick={openWidget}>
            <h1>BUY THIS FUCKER</h1>
        </button>}
        <br/>
        <Link href={`event/${id}/result`}>
          <button>
            <h3>Check for tickets</h3>
          </button>
        </Link>
        <br/>
      </> :
      <>
        <p>Log in to MetaMask to interact with tokens</p>
        <MetaMaskLinks/>
      </>
    }
  </>;
}
