'use client';

import EventName from '@/app/components/Event/EventName';
import SubheaderUnderlined from '@/app/components/SubheaderUnderlined/SubheaderUnderlined';
import { useHasProvider } from '@/app/hooks/useHasProvider';
import { selectIsLoading, setIsLoading } from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { EventInterface } from '@/app/typings/event.interface';
import { TicketInterface } from '@/app/typings/ticket.interface';
import { classNames } from '@/app/utils';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import React, { ReactElement, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import axios from 'axios';

import styles from './MyTickets.module.scss';

export default function MyTickets({ id: eventId, name, slug }: Partial<EventInterface>): ReactElement {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const { address } = useAccount();

  const hasProvider = useHasProvider();
  const [files, setFiles] = useState<TicketInterface[]>([]);

  useEffect((): void => {
    if (!hasProvider) {
      return;
    }
    const init = async (): Promise<void> => {
      try {
        dispatch(setIsLoading(true));
        await axios.post('/api/' + EndpointsEnum.ASSIGN_TICKET_TO_ADDRESS, {
          address,
          eventId
        });

        const message = 'Zweryfikuj swój adres';

        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address]
        });

        const res = await axios.post('/api/' + EndpointsEnum.GET_MY_REWARDS, {
          signature,
          message,
          address,
          eventId
        });
        setFiles(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    init().finally();
  }, [address, address, dispatch, eventId, hasProvider]);

  return (
    <div className="pb-2 flex flex-col">
      {name && (
        <>
          <EventName name={name} slug={slug} />
          <SubheaderUnderlined name={'Moje Nagrody'} />
        </>
      )}
      {files?.map(({ title, description, url, isRewardCollected }, idx) => (
        <div key={idx} className={classNames('bg-purple-200 rounded-xl p-4 my-4', styles.ticket)}>
          <h2 className="text-xl text-purple-950">{title}</h2>
          <div
            className="text-sm mt-1 font-inter m-auto"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                marked
                  .parse(description || '', { mangle: false, headerIds: false })
                  .replace(
                    '<a ',
                    `<a ${
                      url ? 'target="_blank"' : ''
                    } class="underline mt-1 text-purple-900 font-mogra cursor-pointer outline-none text-base"`
                  )
              )
            }}
          />
          {url && (
            <a
              href={url}
              target="_blank"
              className="m-auto mt-4 p-2 w-3/4 font-inter justify-center bg-pink-500 flex item-center text-white px-3 py-2 text-sm font-medium shadow-xl rounded-md hover:brightness-110"
            >
              Pobierz
            </a>
          )}
          {isRewardCollected && (
            <span className="m-auto mt-4 p-2 w-3/4 font-inter justify-center bg-green-500 flex item-center text-white px-3 py-2 text-sm font-medium shadow-xl rounded-md">
              Nagroda odebrana
            </span>
          )}
        </div>
      ))}
      {!isLoading && files?.length === 0 && (
        <h1 className="text-xl text-white my-2 text-center">
          {address ? 'Brak dostępnych nagród :(' : 'Podłącz Portfel żeby zobaczyć nagrody'}
        </h1>
      )}
    </div>
  );
}
