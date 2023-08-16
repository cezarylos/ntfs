'use client';

import TokenModal from '@/app/components/Modals/TokenModal/TokenModal';
import ProgressBar from '@/app/components/ProgressBar/ProgressBar';
import MetamaskLinks from '@/app/components/metamaskLinks';
import { useAddEventNetwork } from '@/app/hooks/useAddEventNetwork';
import { useIsCurrentChainIdSameAsEventChainId } from '@/app/hooks/useIsCurrentChainIdSameAsEventChainId';
import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useSwitchChain } from '@/app/hooks/useSwitchChain';
import { getMyEventTokens, selectIsMyEventTokensLoading, selectMyEventTokens } from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { EventInterface } from '@/app/typings/event.interface';
import { classNames, getChainIdFromString } from '@/app/utils';
import Image from 'next/image';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

interface Props extends EventInterface {
  wrapperClassName?: string;
}

export default function EventTokens({
  id,
  chainId,
  wrapperClassName,
  contractAddress,
  maxTokensPerWallet
}: Props): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Record<string, any> | null>(null);
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
      dispatch(await getMyEventTokens({ eventId: id, address }));
    } catch (e) {
      console.error(e);
    }
  }, [switchChain, dispatch, id, address]);

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

  const isMoreThenOneTokenToCollect = maxTokensPerWallet > 1;

  return (
    <>
      {isCurrentChainIdSameAsEventChainId ? (
        <>
          <div className={classNames('my-2', wrapperClassName)}>
            <h2 className="text-xl mb-2 text-yellow-300 uppercase text-center">
              {isMoreThenOneTokenToCollect ? 'MOJE TOKENY' : 'Mój TOKEN'}:
            </h2>
            <ProgressBar max={maxTokensPerWallet} current={myEventTokens.length} isLoading={isMyEventTokensLoading} />
            {selectedToken?.image && (
              <TokenModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                tokenUrl={selectedToken?.image}
                tokenName={selectedToken?.name}
                openSeaUrl={selectedToken?.openseaUrl}
                tokenDescription={selectedToken?.description}
                contractAddress={contractAddress}
                tokenId={selectedToken?.id}
              />
            )}
            {!isMyEventTokensLoading && myEventTokens?.length ? (
              <div className="flex flex-wrap gap-[0.75rem] pb-8 mt-4 justify-center">
                {myEventTokens.map((token: any, id: number) => {
                  return (
                    token.image &&
                    token.description && (
                      <div
                        key={`${token.tokenId}_${id}`}
                        className="max-w-[calc(50%-0.75rem)] cursor-pointer hover:brightness-110 rounded-md drop-shadow-xl shadow-red-500"
                      >
                        <Image
                          onClick={onTokenClick(token)}
                          src={token.image}
                          alt={token.name}
                          width={0}
                          height={0}
                          fill={false}
                          priority
                          sizes={'100vw'}
                          style={{ width: '100%', height: '100%' }}
                          className="rounded-md"
                        />
                      </div>
                    )
                  );
                })}
              </div>
            ) : (
              !isMyEventTokensLoading && (
                <p className="text-white text-md mt-4">Nie masz w tym momencie żadnych tokenów</p>
              )
            )}
          </div>
        </>
      ) : (
        <>
          <MetamaskLinks />
        </>
      )}
    </>
  );
}
