'use client';

import { ReactElement, useCallback, useEffect, useState } from 'react';
import { StrapiService } from '@/app/services/strapi.service';
import { EventInterface } from '@/app/typings/event.interface';
import axios from 'axios';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { getMaticProvider } from '@/app/utils';

export default function Page(): ReactElement {
  const [password, setPassword] = useState('');
  const [adminUser, setAdminUser] = useState<{ jwt: string; } | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const handleSend = async (): Promise<void> => {
    try {
      const res = await StrapiService.loginAdmin(password);
      setAdminUser(res);
    } catch (e) {
      setError(e.response.data.error.message);
      console.error(e);
    }
  };

  const getEvents = useCallback(async (): Promise<void> => {
    try {
      const res = await StrapiService.getAllEvents(['eventName']);
      setEvents(res);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect((): void => {
    if (adminUser) {
      getEvents().finally();
    }
  }, [adminUser, getEvents]);

  const startLottery = useCallback((eventId: number): () => void => async (): Promise<void> => {
    if (!adminUser || !window) {
      return;
    }
    if (!adminUser.jwt) {
      setError('No jwt. Refresh page');
      return;
    }
    try {
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
  }, [adminUser, setLog, log]);

  return (
    <div>
      <h1>Admin</h1>
      <br />
      <br />
      {!adminUser && <>
        <label>Admin password:</label>
        <input type='password' onChange={event => setPassword(event.target.value)} />
        <button onClick={handleSend}>
          SEND
        </button>
      </>}
      {error && <p>{error}</p>}
      {events?.map((event: EventInterface) =>
        <div key={event.id} style={{ display: 'flex', marginBottom: '24px' }}>
          <p>{event.eventName}</p>
          <button onClick={startLottery(event.id)}>Start lottery</button>
        </div>
      )}
      <br />
      <br />
      <h3>LOG</h3>
      {log.map((message: string, id: number) => <p key={id}>{message}</p>)}
    </div>
  );
}
