'use client';

import PaymentModal from '@/app/components/Modals/PaymentModal/PaymentModal';
import { useAddEventNetwork } from '@/app/hooks/useAddEventNetwork';
import { useSwitchChain } from '@/app/hooks/useSwitchChain';
import {
  selectEventSupplyData,
  selectMyEventTokens,
  setIsLoading,
  setIsShowWeb3BlockerModal
} from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { PAYMENT_STATUS_STRING, SUCCESS_STRING } from '@/app/typings/common.typings';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { LocalStorageEnum } from '@/app/typings/localStorage.enum';
import { classNames, getChainIdFromString, getTokenWord } from '@/app/utils';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

import axios from 'axios';

interface Props {
  slug: string;
  eventId: string | number;
  chainId: string;
  checkoutProjectId: string;
  checkoutCollectionId: string;
  collectionImage: string;
  amountOfTokensToGetReward: number;
  maxTokensPerWallet: number;
  buttonContent?: string;
  isPreviewImgShown?: boolean;
}

export default function AcquireToken({
  slug,
  eventId,
  chainId,
  checkoutProjectId,
  collectionImage,
  buttonContent,
  amountOfTokensToGetReward,
  isPreviewImgShown = true,
  checkoutCollectionId,
  maxTokensPerWallet
}: Props): ReactElement {
  const params = useSearchParams();
  const isStatusSuccess = params?.get(PAYMENT_STATUS_STRING)?.split('?')?.[0] === SUCCESS_STRING;
  const dispatch = useAppDispatch();
  const { tokensLeft } = useAppSelector(selectEventSupplyData);
  const myEventTokens = useAppSelector(selectMyEventTokens);
  const router = useRouter();

  const [isBuyPanelOpen, setIsBuyPanelOpen] = useState(false);
  const [isShowTokenDelayMessage, setIsShowTokenDelayMessage] = useState(false);

  const eventChainId = useMemo((): number => getChainIdFromString(chainId) as number, [chainId]);
  const { address } = useAccount();

  const isTokensLeftMoreThenZero = useMemo((): boolean => (tokensLeft || 0) > 0, [tokensLeft]);
  const isAllowMintMore = useMemo(
    (): boolean => (myEventTokens.length || 0) < maxTokensPerWallet,
    [myEventTokens.length, maxTokensPerWallet]
  );

  const switchChain = useSwitchChain(eventChainId);
  const addEventNetwork = useAddEventNetwork(eventChainId);

  const openWidget = useCallback(async (): Promise<void> => {
    if (isBuyPanelOpen || !isAllowMintMore) {
      return;
    }
    if (!address) {
      dispatch(setIsShowWeb3BlockerModal(true));
      return;
    }
    try {
      await switchChain();
      dispatch(setIsLoading(true));
      setIsBuyPanelOpen(true);
      localStorage.setItem(LocalStorageEnum.TOKENS_COUNT, `${(myEventTokens?.length || 0).toString()}:${eventId}`);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [isBuyPanelOpen, isAllowMintMore, address, dispatch, switchChain, myEventTokens?.length, eventId]);

  useEffect((): void => {
    addEventNetwork().finally();
  }, [addEventNetwork]);

  useEffect((): void => {
    if (!isStatusSuccess || !address || !eventId) {
      return;
    }
    const assignTicket = async (): Promise<void> => {
      try {
        dispatch(setIsLoading(true));
        await axios.post('/api/' + EndpointsEnum.ASSIGN_TICKET_TO_ADDRESS, {
          address,
          eventId
        });
      } catch (e) {
        console.error(e);
      } finally {
        router.push(`/collections/${slug}/tokens`);
        dispatch(setIsLoading(false));
      }
    };
    assignTicket().finally();
  }, [address, dispatch, eventId, isStatusSuccess, router, slug]);

  useEffect((): void => {
    const valFromStorage = localStorage.getItem(LocalStorageEnum.TOKENS_COUNT);
    const tokensCount = valFromStorage?.split(':')?.[0];
    const eventIdFromStorage = valFromStorage?.split(':')?.[1];
    const isTokenDelayMessageShownValue =
      (myEventTokens?.length || 0).toString() === tokensCount && eventIdFromStorage === eventId.toString();
    setIsShowTokenDelayMessage(isTokenDelayMessageShownValue);
  }, [eventId, isStatusSuccess, myEventTokens]);

  return (
    <>
      <PaymentModal
        isOpen={isBuyPanelOpen}
        setIsOpen={setIsBuyPanelOpen}
        address={address as string}
        slug={slug}
        amount={amountOfTokensToGetReward}
        maxTokensPerWallet={maxTokensPerWallet}
        checkoutProjectId={checkoutProjectId}
        eventChainId={eventChainId}
        eventId={eventId}
        checkoutCollectionId={checkoutCollectionId}
      />

      <div className="flex flex-col mt-4 mb-6">
        {isPreviewImgShown && (
          <Image
            onClick={openWidget}
            src={collectionImage}
            alt={'collectionImage'}
            width={0}
            height={0}
            fill={false}
            priority
            sizes={'100vw'}
            style={{ width: '100%', height: '100%' }}
            className={classNames(
              'max-w-[calc(50%)] h-auto m-auto rounded-md drop-shadow-xl outline-none',
              isAllowMintMore && 'hover:brightness-110 cursor-pointer'
            )}
          />
        )}
        {isTokensLeftMoreThenZero && (
          <>
            <button
              onClick={openWidget}
              disabled={!isAllowMintMore}
              className="m-auto mt-6 p-4 w-3/4 justify-center bg-pink-500 flex item-center text-white text-lg shadow-xl rounded-md hover:brightness-110 disabled:cursor-auto disabled:text-opacity-50 disabled:hover:brightness-100 disabled:bg-gray-500/50"
            >
              <h1>{buttonContent || 'KUP TOKEN'}</h1>
            </button>
            {!isAllowMintMore && (
              <p className="text-white text-center mt-6">
                Sorki, limit {maxTokensPerWallet} {getTokenWord(maxTokensPerWallet)} na portfel :(
              </p>
            )}
          </>
        )}
        {isShowTokenDelayMessage && (
          <p className="text-white text-center mt-6 font-inter text-lg">
            *** Jeśli nie widzisz swoich tokenów daj nam chwilkę i odśwież tę stronę za kilanaście sekund ***
          </p>
        )}
      </div>
    </>
  );
}
