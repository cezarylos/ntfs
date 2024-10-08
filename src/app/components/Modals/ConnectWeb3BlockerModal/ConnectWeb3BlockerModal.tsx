import { selectIsShowWeb3BlockerModal, setIsShowWeb3BlockerModal } from '@/app/store/global/global.slice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, ReactElement, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function ConnectWeb3BlockerModal(): ReactElement {
  const dispatch = useAppDispatch();
  const isShowWeb3BlockerModal = useAppSelector(selectIsShowWeb3BlockerModal);
  const { isConnected } = useAccount();

  const closeModal = useCallback((): void => {
    dispatch(setIsShowWeb3BlockerModal(false));
  }, [dispatch]);

  useEffect(() => {
    if (isConnected) {
      closeModal();
    }
  }, [closeModal, isConnected]);

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
                <Dialog.Panel className="flex flex-col w-full h-auto max-w-md transform overflow-hidden rounded-2xl bg-purple-200 border-solid p-6 text-left align-middle shadow-3xl transition-all">
                  <div className="flex flex-col w-full h-auto max-w-md transform overflow-hiddenborder-solid p-3 text-left align-middle">
                    <h3 className="text-xl text-purple-950 font-inter text-center font-medium leading-6">
                      Podłącz Portfel, żeby kupić
                      <br />
                      <span className="text-transparent bg-gradient-to-r bg-clip-text from-cyan-500 to-yellow-500 text-2xl font-mogra">
                        TOKENY
                      </span>
                    </h3>
                  </div>
                  <button className="rounded-md text-white font-semibold text-lg hover:brightness-110 font-inter px-4 py-2 mx-auto w-auto">
                    <w3m-connect-button label={'Podłącz Portfel'} loadingLabel={'Łączenie...'} size={'md'} />
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
