'use client';

import styles from '@/app/components/AcquireToken/AcquireToken.module.scss';
import GlobalLoader from '@/app/components/GlobalLoader/GlobalLoader';
import AmountInput from '@/app/components/Modals/PaymentModal/AmountInput';
import { setIsLoading } from '@/app/store/global/global.slice';
import { useAppDispatch } from '@/app/store/store';
import { ChainsIdsEnum } from '@/app/typings/chains.enum';
import { ModalInterface, PAYMENT_STATUS_STRING, SUCCESS_STRING } from '@/app/typings/common.typings';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { classNames, getTokenWord } from '@/app/utils';
import { CrossmintPayButton } from '@crossmint/client-sdk-react-ui';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { formatEther } from 'viem';
import { useSendTransaction, useWaitForTransaction } from 'wagmi';

interface Props extends ModalInterface {
  slug: string;
  address: string;
  amount: number;
  maxTokensPerWallet: number;
  checkoutProjectId: string;
  checkoutCollectionId: string;
  eventId: string | number;
  eventChainId: ChainsIdsEnum;
}

export default function PaymentModal({
  isOpen,
  setIsOpen,
  slug,
  address,
  amount,
  checkoutProjectId,
  eventId,
  checkoutCollectionId,
  maxTokensPerWallet,
  eventChainId
}: Props): ReactElement {
  const dispatch = useAppDispatch();

  const [mintParams, setMintParams] = useState({} as any);
  const [tokenPrice, setTokenPrice] = useState(0);

  const { data, isLoading, sendTransaction, error } = useSendTransaction({
    to: mintParams?.to,
    value: mintParams?.value,
    data: mintParams?.data
  });

  const {
    isLoading: isTransactionLoading,
    isSuccess: isTransactionSuccess,
    error: transactionError
  } = useWaitForTransaction({
    hash: data?.hash
  });

  const [tokenAmount, setTokenAmount] = useState(amount);

  function closeModal() {
    setIsOpen(false);
    dispatch(setIsLoading({ isLoading: false }));
  }

  const successRedirectionLink = useMemo((): string => {
    const origin = process.env.NODE_ENV === 'production' ? 'https://realbrain.art' : window.origin;
    return `${origin}/collections/${slug}/tokens?${PAYMENT_STATUS_STRING}=${SUCCESS_STRING}`;
  }, [slug]);

  useEffect((): void => {
    if (!address || !eventId) {
      return;
    }
    const init = async (): Promise<void> => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const params = {
          address,
          eventId: eventId.toString(),
          amount: tokenAmount.toString()
        };
        const queryString = new URLSearchParams(params).toString();
        const mintParamsResponse = await fetch(`/api/${EndpointsEnum.GET_MINT_PARAMS}?${queryString}`, {
          next: { revalidate: 60 }
        });
        const { price, transactionParameters } = await mintParamsResponse.json();
        setTokenPrice(price);
        setMintParams(transactionParameters);
      } catch (e) {
        console.error(e);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };
    init().finally();
  }, [address, tokenAmount, dispatch, eventId]);

  const mintConfig = useMemo(
    () => ({
      type: 'erc-721',
      totalPrice: formatEther(tokenPrice as any),
      _amount: tokenAmount
    }),
    [tokenAmount, tokenPrice]
  );

  useEffect((): void => {
    if (error || transactionError) {
      alert('Transaction failed!');
      dispatch(setIsLoading({ isLoading: false }));
    }
  }, [dispatch, error, transactionError]);

  useEffect((): void => {
    if (isTransactionSuccess) {
      dispatch(setIsLoading({ isLoading: false }));
      window.location.href = successRedirectionLink;
    }
  }, [dispatch, isTransactionSuccess, successRedirectionLink]);

  useEffect((): void => {
    dispatch(setIsLoading({ isLoading: isTransactionLoading || isLoading }));
  }, [dispatch, isTransactionLoading, isLoading]);

  const mintWithCrypto = useCallback(async () => {
    if (!mintParams || typeof mintParams !== 'object') {
      return;
    }
    dispatch(setIsLoading({ isLoading: true }));
    sendTransaction?.();
  }, [mintParams, dispatch, sendTransaction]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <GlobalLoader />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto bg-black/50">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex flex-col w-full h-auto max-w-md lg:max-w-lg transform overflow-hidden rounded-2xl bg-purple-200 border-solid p-6 text-left align-middle shadow-3xl transition-all">
                  {maxTokensPerWallet && (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-3xl text-center font-medium leading-6 text-purple-950 uppercase"
                      >
                        <h1 className={classNames('text-xl font-bold text-purple-900 outline-none relative')}>
                          Wybierz ilość
                        </h1>
                      </Dialog.Title>
                      <AmountInput amount={tokenAmount} setAmount={setTokenAmount} maxAmount={maxTokensPerWallet} />
                      <h1 className="text-lg text-center mb-4 text-purple-800">
                        Max {maxTokensPerWallet} {getTokenWord(maxTokensPerWallet)} na portfel
                      </h1>
                    </>
                  )}
                  <Dialog.Title
                    as="h3"
                    className="text-3xl text-center font-medium leading-6 text-purple-950 uppercase"
                  >
                    <h1 className={classNames('text-xl font-bold text-purple-900 outline-none relative')}>
                      Wybierz metodę płatności
                    </h1>
                  </Dialog.Title>
                  <div>
                    <CrossmintPayButton
                      projectId={checkoutProjectId}
                      collectionId={checkoutCollectionId}
                      clientId={checkoutCollectionId}
                      mintConfig={mintConfig}
                      environment={
                        process.env.NEXT_PUBLIC_ENV === 'production'
                          ? 'production'
                          : 'staging'
                      }
                      successCallbackURL={successRedirectionLink}
                      mintTo={address}
                      className={styles.xmintBtn}
                      style={{ background: '#ec4899' }}
                      showOverlay={false}
                    />
                    <button
                      onClick={mintWithCrypto}
                      className="m-auto mt-6 p-4 w-3/4 justify-center uppercase bg-pink-500 flex item-center text-white text-lg shadow-xl rounded-md hover:brightness-110 disabled:cursor-auto disabled:text-opacity-50 disabled:hover:brightness-100 disabled:bg-gray-500/50"
                    >
                      <h1>CRYPTO - MATIC</h1>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
