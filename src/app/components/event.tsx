'use client'; // this is a client component 👈🏽

import Web3 from 'web3';

import { EventInterface } from '@/app/typings/event.interface';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { marked } from 'marked';
import Checkout from '@/app/components/checkout';

export default function Event({ id, winterProjectId }: EventInterface): ReactElement {
  const [myTokens, setMyTokens] = useState([]);
  const [address, setAddress] = useState(null);
  const [isBuyPanelOpen, setIsBuyPanelOpen] = useState(false);

  const toggleBuyPanel = () => {
    setIsBuyPanelOpen(!isBuyPanelOpen);
  }

  const getMyTokens = useCallback(async () => {
    const web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const currentAccount = accounts[0];
    setAddress(currentAccount);
    const providerUrl = window.ethereum.chainId === '0x89' ?
      'https://rpc-mainnet.matic.network' :
      'https://rpc-mumbai.maticvigil.com';

    const myTokensResponse = await axios.get(`/api/${EndpointsEnum.GET_MY_TOKENS}`, {
      params: {
        providerUrl,
        address: currentAccount,
        eventId: id
      }
    });

    setMyTokens(myTokensResponse.data);
  }, [window]);

  useEffect(() => {
    if (!window?.ethereum) {
      return;
    }
    getMyTokens().finally();
  }, [window, getMyTokens]);

  return <>
    {address && <Checkout address={address} projectId={winterProjectId} isBuyPanelOpen={isBuyPanelOpen}
                          setIsBuyPanelOpen={setIsBuyPanelOpen} />}
    <div>
      <h2>MY TOKENS:</h2>
      {myTokens.map((token: any) => {
        return <div key={token.tokenId}>
          <div>{token.name}</div>
          <div
            dangerouslySetInnerHTML={{ __html: marked.parse(token.description).replace('<a ', '<a target="_blank" ') }} />
          <div>{token.tokenId}</div>
          <img style={{ width: '100px' }} src={token.image} alt={token.name} />
        </div>;
      })}
    </div>
    <br/>
    <br/>
    <br/>
    <button onClick={toggleBuyPanel}>
      <h1>BUY THIS FUCKER</h1>
    </button>
  </>;
}
