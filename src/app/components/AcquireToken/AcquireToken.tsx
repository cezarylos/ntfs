'use client';

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
import { classNames, getChainIdFromString } from '@/app/utils';
import { marked } from 'marked';
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

  const switchChain = useSwitchChain(eventChainId);
  const addEventNetwork = useAddEventNetwork(eventChainId);

  const openWidget = useCallback(async (): Promise<void> => {
    if (isBuyPanelOpen) {
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
  }, [address, dispatch, switchChain, isBuyPanelOpen]);

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
  const isAllowMintMore = useMemo(
    (): boolean => (myEventTokens.length || 0) < amountOfTokensToGetReward,
    [myEventTokens.length, amountOfTokensToGetReward]
  );

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
      {isTokensLeftMoreThenZero && (
        <div className="flex flex-col my-4">
          {isPreviewImgShown && (
            <img
              onClick={openWidget}
              src={collectionImage}
              alt={'collectionImage'}
              className={classNames(
                'max-w-[calc(33.33%)] h-auto m-auto rounded-md drop-shadow-xl shadow-red-500',
                isAllowMintMore && 'hover:brightness-110 cursor-pointer'
              )}
            />
          )}
          <button
            onClick={openWidget}
            disabled={!isAllowMintMore}
            className="m-auto mt-2 p-4 w-3/4 justify-center bg-pink-500 flex item-center text-white text-lg rounded-md hover:brightness-110 disabled:cursor-auto disabled:text-opacity-50 disabled:hover:brightness-100 disabled:bg-gray-500/50"
          >
            <h1>{buttonContent || 'ZGARNIJ TOKEN'}</h1>
          </button>
          {!isAllowMintMore && (
            <p className="text-white text-center mt-4">Ziomek, limit {amountOfTokensToGetReward} tokenów na portfel</p>
          )}
        </div>
      )}
    </>
  );
}
