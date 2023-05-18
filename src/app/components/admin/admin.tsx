'use client';

import { useRedirectWhenNoProvider } from '@/app/hooks/useRedirectWhenNoProvider';
import { StrapiService } from '@/app/services/strapi.service';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { EventInterface } from '@/app/typings/event.interface';
import { getChainIdFromString, getMaticProvider } from '@/app/utils';
import React, { ReactElement, useCallback, useState } from 'react';

import axios from 'axios';

interface AdminProps {
  events: EventInterface[];
}

export default function Admin({ events }: AdminProps): ReactElement {
  const hasProvider = useRedirectWhenNoProvider();
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

  const startLottery = useCallback(
    (eventId: number, chainId: string): (() => void) =>
      async (): Promise<void> => {
        if (!adminUser || !window) {
          return;
        }
        if (!adminUser.jwt) {
          setError('No jwt. Refresh page');
          return;
        }
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: getChainIdFromString(chainId) }]
          });
          const providerUrl = await getMaticProvider(window);
          const res = await axios.get(`/api/${EndpointsEnum.START_LOTTERY}/${eventId}`, {
            params: {
              jwt: adminUser.jwt,
              providerUrl,
              eventId
            }
          });
          setLog([res.data.message, ...log]);
        } catch (e) {
          console.error(e);
        }
      },
    [adminUser, setLog, log]
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
          <div key={event.id} style={{ display: 'flex', marginBottom: '24px' }}>
            <p>{event.eventName}</p>
            <button onClick={startLottery(event.id, event.chainId)}>Start lottery</button>
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
