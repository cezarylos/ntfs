import styles from '@/app/components/AcquireToken/AcquireToken.module.scss';
import { StrapiService } from '@/app/services/strapi.service';
import { setIsLoading } from '@/app/store/global/global.slice';
import { useAppDispatch } from '@/app/store/store';
import { ModalInterface } from '@/app/typings/common.typings';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { classNames, getChainIdFromString, getMaticProvider } from '@/app/utils';
import { CrossmintPayButton } from '@crossmint/client-sdk-react-ui';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';

interface Props extends ModalInterface {
  slug: string;
  address: string;
  amount: number;
  checkoutProjectId: string;
  eventId: string | number;
  eventChainId: string;
}

export default function PaymentModal({
  isOpen,
  setIsOpen,
  slug,
  address,
  amount,
  checkoutProjectId,
  eventChainId,
  eventId
}: Props): ReactElement {
  const dispatch = useAppDispatch();

  const [tokenPrice, setTokenPrice] = useState(0);
  const [mintParams, setMintParams] = useState(null);
  function closeModal() {
    setIsOpen(false);
    dispatch(setIsLoading(false));
  }

  useEffect((): void => {
    if (!address || !eventId) {
      return;
    }
    const init = async (): Promise<void> => {
      dispatch(setIsLoading(true));
      try {

        const params = {
          address,
          eventId: eventId.toString()
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
        dispatch(setIsLoading(false));
      }
    };
    init().finally();
  }, [address, dispatch, eventId]);

  const mintConfig = useMemo(
    () => ({
      type: 'erc-721',
      totalPrice: tokenPrice?.toString(),
      _amount: amount,
      quantity: amount
    }),
    [amount, tokenPrice]
  );

  const mintWithCrypto = useCallback(async () => {
    if (!mintParams || typeof mintParams !== 'object') {
      return;
    }
    const providerUrl = getMaticProvider(eventChainId);
    const web3 = new Web3(providerUrl);

    dispatch(setIsLoading(true));

    const transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [mintParams]
    });

    const waitForTransactionConfirmation = async (transactionHash: string): Promise<void> => {
      try {
        const receipt = await web3.eth.getTransactionReceipt(transactionHash);
        if (receipt) {
          if (receipt.status) {
            console.log('Transaction successful!');
            console.log('Receipt:', receipt);
            window.location.reload();
          } else {
            console.log('Transaction failed!');
            console.log('Receipt:', receipt);
            alert('Transaction failed!');
            dispatch(setIsLoading(false));
          }
        }
      } catch (error) {
        setIsOpen(false);
        setTimeout(() => waitForTransactionConfirmation(transactionHash), 1000); // Retry after 1 second
        console.error('Error:', error);
      }
    };

    await waitForTransactionConfirmation(transactionHash as string);
  }, [dispatch, eventChainId, mintParams, setIsOpen, tokenPrice, eventChainId]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                  <Dialog.Title as="h3" className="text-3xl text-center font-medium leading-6 text-purple-950">
                    <h1 className={classNames('text-xl font-bold text-purple-900 outline-none relative')}>
                      Wybierz metodę płatności
                    </h1>
                  </Dialog.Title>
                  <div>
                    <CrossmintPayButton
                      clientId={checkoutProjectId}
                      mintConfig={mintConfig}
                      environment={process.env.NEXT_PUBLIC_ENV === 'production' ? 'production' : 'staging'}
                      successCallbackURL={`https://realbrain.art/events/${slug}/tokens`}
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
