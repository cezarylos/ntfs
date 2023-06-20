'use client';

import PaymentModal from '@/app/components/Modals/PaymentModal/PaymentModal';
import Checkout from '@/app/components/checkout';
import { useAddEventNetwork } from '@/app/hooks/useAddEventNetwork';
import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useSwitchChain } from '@/app/hooks/useSwitchChain';
import {
  getEventTokensSupplyData,
  getMyEventTokens,
  selectEventSupplyData,
  selectMyEventTokens,
  setIsLoading,
  setIsShowWeb3BlockerModal
} from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { EventInterface } from '@/app/typings/event.interface';
import { classNames, getChainIdFromString, getTokenWord } from '@/app/utils';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

interface Props {
  slug: string;
  eventId: number;
  chainId: string;
  checkoutProjectId: string;
  collectionImage: string;
  amountOfTokensToGetReward: number;
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
  isPreviewImgShown = true
}: Props): ReactElement {
  const { wallet } = useMetaMask();
  const dispatch = useAppDispatch();
  const { tokensLeft } = useAppSelector(selectEventSupplyData);
  const myEventTokens = useAppSelector(selectMyEventTokens);

  const [isBuyPanelOpen, setIsBuyPanelOpen] = useState(false);

  const eventChainId = useMemo((): string => getChainIdFromString(chainId), [chainId]);
  const address = useMemo((): string => wallet.accounts?.[0], [wallet.accounts]);
  const isTokensLeftMoreThenZero = useMemo((): boolean => (tokensLeft || 0) > 0, [tokensLeft]);
  const isAllowMintMore = useMemo(
    (): boolean => (myEventTokens.length || 0) < amountOfTokensToGetReward,
    [myEventTokens.length, amountOfTokensToGetReward]
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
    } catch (e) {
      console.error(e);
    }
  }, [isBuyPanelOpen, isAllowMintMore, address, dispatch, switchChain]);

  const onWidgetSuccess = useCallback(async (): Promise<void> => {
    dispatch(setIsLoading(false));
  }, [dispatch]);

  const onClose = useCallback((): void => {
    setIsBuyPanelOpen(false);
    dispatch(getEventTokensSupplyData({ id: eventId } as EventInterface));
    dispatch(getMyEventTokens({ eventId, eventChainId, address }));
    dispatch(setIsLoading(false));
  }, [address, dispatch, eventChainId, eventId]);

  useEffect((): void => {
    addEventNetwork().finally();
  }, [addEventNetwork]);

  return (
    <>
      <Checkout
        address={address}
        projectId={checkoutProjectId}
        isBuyPanelOpen={isBuyPanelOpen}
        onSuccess={onWidgetSuccess}
        onClose={onClose}
        mintQuantity={amountOfTokensToGetReward - myEventTokens.length}
      />
      {/*<PaymentModal*/}
      {/*  isOpen={isBuyPanelOpen}*/}
      {/*  setIsOpen={setIsBuyPanelOpen}*/}
      {/*  address={address}*/}
      {/*  slug={slug}*/}
      {/*  amount={amountOfTokensToGetReward}*/}
      {/*  checkoutProjectId={checkoutProjectId}*/}
      {/*  eventChainId={eventChainId}*/}
      {/*  eventId={eventId}*/}
      {/*/>*/}
      {isTokensLeftMoreThenZero && (
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
                'max-w-[calc(50%)] h-auto m-auto rounded-md drop-shadow-xl shadow-red-500 outline-none',
                isAllowMintMore && 'hover:brightness-110 cursor-pointer'
              )}
            />
          )}
          <button
            onClick={openWidget}
            disabled={!isAllowMintMore}
            className="m-auto mt-6 p-4 w-3/4 justify-center bg-pink-500 flex item-center text-white text-lg shadow-xl rounded-md hover:brightness-110 disabled:cursor-auto disabled:text-opacity-50 disabled:hover:brightness-100 disabled:bg-gray-500/50"
          >
            <h1>{buttonContent || 'KUP TOKEN'}</h1>
          </button>
          {!isAllowMintMore && (
            <p className="text-white text-center mt-6">
              Sorki, limit {amountOfTokensToGetReward} {getTokenWord(amountOfTokensToGetReward)} na portfel :(
            </p>
          )}
        </div>
      )}
    </>
  );
}
