'use client'; // this is a client component 👈🏽

import { EventInterface } from '@/app/typings/event.interface';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { marked } from 'marked';
import Checkout from '@/app/components/checkout';
import { getMaticProvider } from '@/app/utils';
import Web3 from 'web3';
import Link from 'next/link';

export default function Event({ id, winterProjectId }: EventInterface): ReactElement {
  const [myTokens, setMyTokens] = useState([]);
  const [address, setAddress] = useState(null);
  const [isBuyPanelOpen, setIsBuyPanelOpen] = useState(false);
  const [tokensLeft, setTokensLeft] = useState(0);

  const toggleBuyPanel = () => {
    setIsBuyPanelOpen(!isBuyPanelOpen);
  };

  const getMyTokens = useCallback(async () => {
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
  }, [window]);

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

  useEffect(() => {
    if (!window?.ethereum) {
      return;
    }
    const init = async () => {
      await Promise.all([getMyTokens(), getTokensLeft()]);
    };
    init().finally();
  }, [getMyTokens, getTokensLeft]);

  return <>
    {address && <Checkout
      address={address}
      projectId={winterProjectId}
      isBuyPanelOpen={isBuyPanelOpen}
      setIsBuyPanelOpen={setIsBuyPanelOpen}
      onSuccess={getMyTokens}
    />}
    <h1>Tokens left: {tokensLeft}</h1>
    <div>
      <h2>MY TOKENS:</h2>
      {myTokens.map((token: any, id: number) => {
        return <div key={`${token.tokenId}_${id}`} style={{ marginBottom: '24px' }}>
          <div>{token.name}</div>
          <div
            dangerouslySetInnerHTML={{ __html: marked.parse(token.description).replace('<a ', '<a target="_blank" ') }} />
          <div>{token.tokenId}</div>
          <img style={{ width: '100px' }} src={token.image} alt={token.name} />
        </div>;
      })}
    </div>
    <br />
    <br />
    <br />
    {!!tokensLeft && <button onClick={toggleBuyPanel}>
      <h1>BUY THIS FUCKER</h1>
    </button>}
    <Link href={`event/${id}/result`}>
      <button>
        <h3>Check for tickets</h3>
      </button>
    </Link>
  </>;
}
