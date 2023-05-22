'use client';

import TokenModal from '@/app/components/TokenModal/TokenModal';
import MetaMaskLinks from '@/app/components/metamaskLinks';
import { useAddEventNetwork } from '@/app/hooks/useAddEventNetwork';
import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useSwitchChain } from '@/app/hooks/useSwitchChain';
import { getEventMyTokens } from '@/app/store/global/global.actions';
import { selectIsMyEventTokensLoading, selectMyEventTokens } from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { EventInterface } from '@/app/typings/event.interface';
import { getChainIdFromString } from '@/app/utils';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

export default function EventTokens({ id, chainId }: EventInterface): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const dispatch = useAppDispatch();
  const myEventTokens = useAppSelector(selectMyEventTokens);
  const isMyEventTokensLoading = useAppSelector(selectIsMyEventTokensLoading);
  const { wallet } = useMetaMask();

  const eventChainId = useMemo((): string => getChainIdFromString(chainId), [chainId]);
  const isCurrentChainIdSameAsEventChainId = useIsCurrentChainIdSameAsEventChainId(eventChainId);

  const switchChain = useSwitchChain(eventChainId);
  const addEventNetwork = useAddEventNetwork(eventChainId);

  const address = useMemo((): string => wallet.accounts?.[0], [wallet.accounts]);

  const getMyTokens = useCallback(async () => {
    try {
      await switchChain();
      dispatch(await getEventMyTokens({ eventId: id, address, eventChainId }));
    } catch (e) {
      console.error(e);
    }
  }, [switchChain, eventChainId, dispatch, id, address]);

  useEffect((): void => {
    addEventNetwork().finally();
  }, [addEventNetwork]);

  useEffect((): void => {
    if (isCurrentChainIdSameAsEventChainId) {
      getMyTokens().finally();
    }
  }, [getMyTokens, isCurrentChainIdSameAsEventChainId]);

  const onTokenClick = (token: any) => () => {
    setSelectedToken(token);
    setIsModalOpen(true);
  };

  return (
    <>
      {isCurrentChainIdSameAsEventChainId ? (
        <>
          <div className="my-2">
            <h2 className="text-md mb-2">MOJE TOKENY:</h2>
            {selectedToken && (
              <TokenModal
                id={selectedToken.id}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                tokenUrl={selectedToken?.image}
                tokenName={selectedToken?.name}
                openSeaUrl={selectedToken?.openseaUrl}
                tokenDescription={selectedToken?.description}
              />
            )}
            {isMyEventTokensLoading && <p className="animate-pulse">ładowanie...</p>}
            {!isMyEventTokensLoading && myEventTokens?.length ? (
              <div className="flex flex-wrap gap-[0.75rem]">
                {myEventTokens.map((token: any, id: number) => {
                  return (
                    <img
                      onClick={onTokenClick(token)}
                      key={`${token.tokenId}_${id}`}
                      src={token.image}
                      alt={token.name}
                      className="max-w-[calc(33.33%-0.75rem)] cursor-pointer hover:brightness-110 hover:animate-pulse rounded-md"
                    />
                  );
                })}
              </div>
            ) : (
              !isMyEventTokensLoading && <p>{`You don't have any tokens yet`}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <p>Log in to MetaMask to interact with tokens</p>
          <MetaMaskLinks />
        </>
      )}
    </>
  );
}