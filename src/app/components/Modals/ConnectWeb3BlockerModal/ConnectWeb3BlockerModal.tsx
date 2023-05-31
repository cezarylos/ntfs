import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useMetaMaskConnect } from '@/app/hooks/useMetaMaskConnect';
import { selectIsShowWeb3BlockerModal, setIsShowWeb3BlockerModal } from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, ReactElement } from 'react';

export default function ConnectWeb3BlockerModal(): ReactElement {
  const dispatch = useAppDispatch();
  const isShowWeb3BlockerModal = useAppSelector(selectIsShowWeb3BlockerModal);
  const onMetaMaskConnect = useMetaMaskConnect();
  const { isConnecting } = useMetaMask();

  const closeModal = (): void => {
    dispatch(setIsShowWeb3BlockerModal(false));
  };

  return isShowWeb3BlockerModal ? (
    <>
      <Transition appear show={isShowWeb3BlockerModal} as={Fragment}>
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
                <Dialog.Panel className="flex flex-col w-full h-auto max-w-md transform overflow-hidden rounded-2xl bg-orange-200 border-2 border-red-600 border-solid p-6 text-left align-middle shadow-3xl transition-all">
                  <Dialog.Title as="h3" className="text-xl text-center font-medium leading-6 text-gray-900">
                    Ej Ziomek, najpierw podłącz poftfel
                  </Dialog.Title>
                  <button
                    className="text-lg rounded-md text-white bg-green-800 p-2 mt-4 mx-auto w-1/2 hover:brightness-110 font-inter"
                    onClick={onMetaMaskConnect}
                  >
                    {isConnecting ? <span className="animate-pulse">Łączenie...</span> : 'Podłącz Portfel'}
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  ) : (
    <></>
  );
}
