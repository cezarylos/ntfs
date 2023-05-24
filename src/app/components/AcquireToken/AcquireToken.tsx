'use client';

import Checkout from '@/app/components/checkout';
import { useAddEventNetwork } from '@/app/hooks/useAddEventNetwork';
import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useSwitchChain } from '@/app/hooks/useSwitchChain';
import {
  selectEventSupplyData,
  selectMyEventTokens,
  setIsLoading,
  getMyEventTokens,
  getEventTokensSupplyData
} from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { EventInterface } from '@/app/typings/event.interface';
import { getChainIdFromString } from '@/app/utils';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

interface Props {
  eventId: number;
  chainId: string;
  onSuccess?: () => Promise<void>;
  winterProjectId: string;
  collectionImage: string;
  amountOfTokensToGetReward: number;
  buttonContent?: string;
  isPreviewImgShown?: boolean;
}

export default function AcquireToken({
  eventId,
  chainId,
  winterProjectId,
  onSuccess,
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

  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);
  const switchChain = useSwitchChain(eventChainId);
  const addEventNetwork = useAddEventNetwork(eventChainId);

  const openWidget = useCallback(async (): Promise<void> => {
    try {
      await switchChain();
      dispatch(setIsLoading(true));
      setIsBuyPanelOpen(true);
    } catch (e) {
      console.error(e);
    }
  }, [dispatch, switchChain, setIsBuyPanelOpen]);

  const onWidgetSuccess = useCallback(async (): Promise<void> => {
    onSuccess?.();
    dispatch(setIsLoading(false));
  }, [dispatch, onSuccess]);

  const onClose = useCallback((): void => {
    setIsBuyPanelOpen(false);
    dispatch(getEventTokensSupplyData({ id: eventId, chainId } as EventInterface));
    dispatch(getMyEventTokens({ eventId, eventChainId, address }));
    dispatch(setIsLoading(false));
  }, [address, chainId, dispatch, eventChainId, eventId]);

  useEffect((): void => {
    addEventNetwork().finally();
  }, [addEventNetwork]);

  const isTokensLeftMoreThenZero = useMemo((): boolean => (tokensLeft || 0) > 0, [tokensLeft]);
  const isAllowMintMore = useMemo((): boolean => (myEventTokens.length || 0) < amountOfTokensToGetReward, [myEventTokens.length, amountOfTokensToGetReward]);

  return (
    <>
      <Checkout
        address={address}
        projectId={winterProjectId}
        isBuyPanelOpen={isBuyPanelOpen}
        onSuccess={onWidgetSuccess}
        onClose={onClose}
        mintQuantity={amountOfTokensToGetReward - myEventTokens.length}
      />
      {address && isCurrentChainIdSameAsEventChainId && isTokensLeftMoreThenZero && (
        <div className="flex flex-col mb-4">
          {isPreviewImgShown && (
            <img src={collectionImage} alt={'collectionImage'} className="max-w-[calc(33.33%)] h-auto m-auto" />
          )}
          <button
            onClick={openWidget}
            disabled={!isAllowMintMore}
            className="m-auto mt-2 p-4 w-3/4 justify-center bg-pink-500 flex item-center rounded-md hover:brightness-110 disabled:cursor-auto disabled:hover:brightness-100 disabled:bg-gray-500/50"
          >
            <h1>{buttonContent || 'ZGARNIJ TOKEN'}</h1>
          </button>
          {!isAllowMintMore && <p className='text-white text-center mt-4'>Ziomek, limit {amountOfTokensToGetReward} tokenów na portfel</p>}
        </div>
      )}
    </>
  );
}
