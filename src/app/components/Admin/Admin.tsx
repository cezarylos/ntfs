'use client';

import { useHasProvider } from '@/app/hooks/useHasProvider';
import { StrapiService } from '@/app/services/strapi.service';
import { setIsLoading } from '@/app/store/global/global.slice';
import { useAppDispatch } from '@/app/store/store';
import { ChainsEnum } from '@/app/typings/chains.enum';
import { EventInterface } from '@/app/typings/event.interface';
import { TicketInterface } from '@/app/typings/ticket.interface';
import { getChainIdFromString, getMaticProvider, polygonRPC, shuffleArray } from '@/app/utils';
import React, { ReactElement, useCallback, useState } from 'react';
import Web3 from 'web3';

interface AdminProps {
  events: EventInterface[];
}

export default function Admin({ events }: AdminProps): ReactElement {
  const dispatch = useAppDispatch();
  const hasProvider = useHasProvider();
  const [password, setPassword] = useState('');
  const [adminUser, setAdminUser] = useState<{ jwt: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const handleSend = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      const res = await StrapiService.loginAdmin(password);
      setAdminUser(res);
    } catch (e) {
      setError(e.response.data.error.message);
      setPassword('');
      console.error(e);
    }
  };

  const runLottery = useCallback(
    async (eventId, chainId): Promise<void> => {
      if (!adminUser || !window) {
        return;
      }
      try {
        const providerUrl = getMaticProvider(chainId);
        const web3 = new Web3(providerUrl);
        const eventResponse = await StrapiService.getEventById(eventId, [
          'contractAddress',
          'ABI',
          'name',
          'amountOfTokensToGetReward',
          'excludedAddressesFromRewards'
        ]);
        const { contractAddress, ABI, name, amountOfTokensToGetReward, excludedAddressesFromRewards } =
          eventResponse.data.attributes;
        const contract = new web3.eth.Contract(ABI, contractAddress);

        const [tickets, totalSupply] = await Promise.all([
          StrapiService.getTicketsByEventId(adminUser?.jwt as string, eventId),
          contract.methods.totalSupply().call()
        ]);
        const addressCounts = new Map();
        const excludedAddressesSet = new Set(excludedAddressesFromRewards.map(address => address.toLowerCase()));
        const uniqueAddresses = new Set();

        for (let i = 1; i <= totalSupply; i++) {
          const ownerAddress = await contract.methods.ownerOf(i).call();
          const count = (addressCounts.get(ownerAddress) || 0) + 1;
          addressCounts.set(ownerAddress, count);

          if (count >= amountOfTokensToGetReward && !excludedAddressesSet.has(ownerAddress.toLowerCase())) {
            uniqueAddresses.add(ownerAddress);
          }
        }

        const mappedTickets = tickets.data.map(({ id, attributes }: { id: number; attributes: TicketInterface }) => ({
          id,
          ...attributes
        }));

        const shuffledHolders = shuffleArray([...uniqueAddresses]);

        await Promise.all(
          mappedTickets.map(async (ticket: TicketInterface, index: number) => {
            if (ticket.holderAddress) {
              return;
            }
            if (shuffledHolders[index]) {
              StrapiService.assignHolderAddressToTicket(
                adminUser?.jwt as string,
                ticket.id,
                shuffledHolders[index]
              ).finally();
            }
          })
        );
      } catch (e) {
        console.error(e);
      }
    },
    [adminUser]
  );

  const startLottery = useCallback(
    (eventId: number, chainId: string) =>
      async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        if (!adminUser || !window) {
          return;
        }
        if (!adminUser.jwt) {
          setError('No jwt. Refresh page');
          return;
        }
        const eventChainId = getChainIdFromString(chainId);
        try {
          dispatch(setIsLoading(true));
          const params =
            eventChainId === ChainsEnum.POLYGON
              ? {
                  chainId: eventChainId,
                  rpcUrls: [polygonRPC],
                  chainName: 'Polygon',
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18
                  },
                  blockExplorerUrls: ['https://polygonscan.com/']
                }
              : {
                  chainId: eventChainId,
                  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  chainName: 'Mumbai Testnet',
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18
                  },
                  blockExplorerUrls: ['https://polygonscan.com/']
                };
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params]
          });
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: eventChainId }]
          });
          await runLottery(eventId, chainId);
          setLog(['Success', ...log]);
        } catch (e) {
          setLog(['Fail', ...log]);
          console.error(e);
        } finally {
          dispatch(setIsLoading(false));
        }
      },
    [adminUser, dispatch, log, runLottery]
  );
  if (!hasProvider) {
    return <></>;
  }

  return (
    <form>
      <h1>Admin</h1>
      <br />
      <br />
      {!adminUser && (
        <>
          <label>Admin password:</label>
          <input value={password} type="password" onChange={event => setPassword(event.target.value)} />
          <button onClick={handleSend} type="submit">
            SEND
          </button>
        </>
      )}
      {error && <p>{error}</p>}
      {adminUser &&
        events?.map((event: EventInterface) => (
          <div key={event.id} className="flex flex-col items-center">
            <p>{event.name}</p>
            <button
              className="text-white text-2xl p-4 rounded-2xl bg-green-400 mt-2 hover:brightness-110"
              onClick={startLottery(event.id, event.chainId)}
            >
              Start lottery
            </button>
          </div>
        ))}
      <br />
      <br />
      {adminUser && !!log.length && (
        <>
          <h3>LOG:</h3>
          {log.map((message: string, id: number) => (
            <p key={id}>{message}</p>
          ))}
        </>
      )}
    </form>
  );
}
