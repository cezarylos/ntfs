'use client';

import Checkout from '@/app/components/checkout';
import { useAddEventNetwork } from '@/app/hooks/useAddEventNetwork';
import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useSwitchChain } from '@/app/hooks/useSwitchChain';
import { getEventMyTokens, getEventTokensSupplyData } from '@/app/store/global/global.actions';
import { selectEventSupplyData, setIsLoading } from '@/app/store/global/global.slice';
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
  isPreviewImgShown = true
}: Props): ReactElement {
  const { wallet } = useMetaMask();
  const dispatch = useAppDispatch();
  const { tokensLeft } = useAppSelector(selectEventSupplyData);

  const [isBuyPanelOpen, setIsBuyPanelOpen] = useState(false);

  const eventChainId = useMemo((): string => getChainIdFromString(chainId), [chainId]);
  const address = useMemo((): string => wallet.accounts?.[0], [wallet.accounts]);

  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);
  const switchChain = useSwitchChain(eventChainId);
  const addEventNetwork = useAddEventNetwork(eventChainId);

  const toggleBuyPanel = useCallback((): void => {
    setIsBuyPanelOpen(!isBuyPanelOpen);
  }, [isBuyPanelOpen]);

  const openWidget = useCallback(async (): Promise<void> => {
    try {
      await switchChain();
      dispatch(setIsLoading(true));
      toggleBuyPanel();
    } catch (e) {
      console.error(e);
    }
  }, [dispatch, switchChain, toggleBuyPanel]);

  const onWidgetSuccess = useCallback(async (): Promise<void> => {
    onSuccess?.();
    toggleBuyPanel();
    dispatch(setIsLoading(false));
    dispatch(getEventTokensSupplyData({ id: eventId, chainId } as EventInterface));
    dispatch(getEventMyTokens({ eventId, eventChainId, address }));
  }, [address, chainId, dispatch, eventChainId, eventId, onSuccess, toggleBuyPanel]);

  useEffect((): void => {
    addEventNetwork().finally();
  }, [addEventNetwork]);

  return (
    <>
      {address && isCurrentChainIdSameAsEventChainId && tokensLeft && (
        <>
          <Checkout
            address={address}
            projectId={winterProjectId}
            isBuyPanelOpen={isBuyPanelOpen}
            setIsBuyPanelOpen={setIsBuyPanelOpen}
            onSuccess={onWidgetSuccess}
          />
          <div className="flex flex-col mb-4">
            {isPreviewImgShown && (
              <img src={collectionImage} alt={'collectionImage'} className="max-w-[calc(33.33%)] h-auto m-auto" />
            )}
            <button
              onClick={openWidget}
              className="m-auto mt-2 p-4 w-3/4 justify-center bg-pink-500 flex item-center rounded-md hover:brightness-110"
            >
              <h1>{buttonContent || 'ZGARNIJ TOKEN'}</h1>
            </button>
          </div>
        </>
      )}
    </>
  );
}
