'use client'; // this is a client component 👈🏽


import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import Web3 from 'web3';
import WinterCheckout from '@usewinter/checkout/dist/components/WinterCheckout';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';

import { marked } from 'marked';
import { EventInterface } from '@/app/typings/event.interface';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { isMobileDevice } from '@/app/utils';

interface HomeInterface {
  events: EventInterface[];
}

export default function Homepage({ events }: HomeInterface): ReactElement {

  const router = useRouter();

  const web3Ref = useRef<Web3>();

  const [address, setAddress] = useState(null);

  const [myTokens, setMyTokens] = useState([]);

  const connectMetamaskMobile = () => {
    const dappUrl = window.location.href.split('//')[1].split('/')[0];
    const metamaskAppDeepLink = 'https://metamask.app.link/dapp/' + dappUrl;
    window.open(metamaskAppDeepLink, '_self');
  };

  const getIsTokenHolder = useCallback(async () => {
    const web3 = new Web3(window.ethereum);
    web3Ref.current = web3;
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const currentAccount = accounts[0];
    setAddress(currentAccount);

    const providerUrl = window.ethereum.chainId === '0x89' ? 'https://rpc-mainnet.matic.network' : 'https://rpc-mumbai.maticvigil.com';

    const res = await fetch(`/api/${EndpointsEnum.IS_TOKEN_HOLDERS}/0x9070A782c3b499cC78Bc65cF2DB1C4C0D9311Ae8?providerUrl=${providerUrl}&address=${currentAccount}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }, [window]);

  const getMyTokens = useCallback(async () => {
    const contractAddress = events[0].contractAddress;
    const web3 = new Web3(window.ethereum);
    web3Ref.current = web3;
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const currentAccount = accounts[0];
    setAddress(currentAccount);

    const providerUrl = window.ethereum.chainId === '0x89' ? 'https://rpc-mainnet.matic.network' : 'https://rpc-mumbai.maticvigil.com';


    const myTokensResponse = await axios.get(`/api/${EndpointsEnum.GET_MY_TOKENS}`, {
      params: {
        providerUrl,
        address: currentAccount,
        contractAddress
      }
    });

    setMyTokens(myTokensResponse.data);
  }, [window]);


  useEffect(() => {
    if (!window?.ethereum) {
      return;
    }
    // getMyTokens().finally();
    // getIsTokenHolder().finally();
  }, [window, getIsTokenHolder, getMyTokens]);


  useEffect(() => {
    const init = async () => {

// Sign the message using the personal_sign method
      const message = 'Hello, world!'; // Replace this with your own message
      const signature = await web3Ref.current.eth.personal.sign(message, address);

      const res = await fetch('/api/' + EndpointsEnum.VERIFY_ADDRESS_OWNERSHIP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ signature, message, address })
      });

      const data = await res.json();

      console.log(data);
    };
    // init().finally();
  }, [address]);

  const isMobile = isMobileDevice();

  return (
    <>
      {isMobile && <button onClick={connectMetamaskMobile}>ENTER</button>}
      {events.map((event: EventInterface) =>
        <button key={event.id} onClick={() => router.push(`/event/${event.id}`)}>
          <h1>{event.eventName}</h1>
          <h4>{event.eventDescription}</h4>
        </button>
      )}
    </>
  );
}
