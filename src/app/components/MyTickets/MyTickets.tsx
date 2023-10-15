'use client';

import EventName from '@/app/components/Event/EventName';
import SubheaderUnderlined from '@/app/components/SubheaderUnderlined/SubheaderUnderlined';
import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useSwitchChain } from '@/app/hooks/useSwitchChain';
import { selectIsLoading, setIsLoading } from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { EventInterface } from '@/app/typings/event.interface';
import { TicketInterface } from '@/app/typings/ticket.interface';
import { classNames, getChainIdFromString } from '@/app/utils';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

import axios from 'axios';

import styles from './MyTickets.module.scss';

const message = 'Zweryfikuj swój adres';

export default function MyTickets({ id: eventId, name, slug, chainId }: Partial<EventInterface>): ReactElement {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const { address, connector, isConnected } = useAccount();
  const {
    data,
    isSuccess,
    signMessage,
    isError,
    isLoading: isSignMessageLoading
  } = useSignMessage({
    message
  });

  const [files, setFiles] = useState<TicketInterface[]>([]);

  const eventChainId = useMemo((): string => getChainIdFromString(chainId as string), [chainId]);
  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);
  const switchChain = useSwitchChain(eventChainId);

  useEffect((): void => {
    if (!connector || !isConnected || !address || !eventId) {
      return;
    }
    const init = async (): Promise<void> => {
      try {
        dispatch(setIsLoading({ isLoading: true }));
        if (!isCurrentChainIdSameAsEventChainId) {
          await switchChain();
          return;
        }
        await axios.post('/api/' + EndpointsEnum.ASSIGN_TICKET_TO_ADDRESS, {
          address,
          eventId
        });
        const signature = await signMessage({
          message: 'gm wagmi frens'
        });
        // signMessage();
      } catch (e) {
        dispatch(setIsLoading({ isLoading: false, extraLoadingInfo: '' }));
        console.error(e);
      }
    };
    init().finally();
  }, [
    address,
    dispatch,
    eventId,
    isConnected,
    signMessage,
    connector,
    switchChain,
    isCurrentChainIdSameAsEventChainId
  ]);

  useEffect((): void => {
    if (isError) {
      dispatch(setIsLoading({ isLoading: false, extraLoadingInfo: '' }));
    }
  }, [dispatch, isError]);

  useEffect(() => {
    if (!isSuccess || !data) {
      return;
    }
    const init = async (): Promise<void> => {
      try {
        const res = await axios.post('/api/' + EndpointsEnum.GET_MY_REWARDS, {
          signature: data,
          message,
          address,
          eventId
        });
        setFiles(res.data);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };
    init().finally();
  }, [isSuccess, data, address, eventId, dispatch]);

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
