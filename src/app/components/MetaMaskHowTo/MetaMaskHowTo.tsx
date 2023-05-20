'use client';

import { connectMetamaskMobile, isMobileDevice } from '@/app/utils';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { Fragment, ReactElement, useState } from 'react';

export default function MetaMaskHowTo(): ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const isMobile = isMobileDevice();

  const closeModal = (): void => {
    setIsOpen(false);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25'/>
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900 text-center'>
                    {isMobile ? 'MetaMask App is required' : 'MetaMask extension is required'}
                    <XMarkIcon onClick={closeModal}
                               className='block h-6 w-6 float-right cursor-pointer hover:opacity-80'
                               aria-hidden='true'/>
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>
                      MetaMask is a wallet that allows you to store your Ethereum and ERC20 tokens. It also allows you
                      to interact with dApps (decentralized applications) on the Ethereum blockchain.
                    </p>
                  </div>

                  <div className='mt-4 flex justify-center'>
                    <button
                      type='button'
                      className='inline-flex align-center justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none'
                    >
                      {isMobile ? (
                        <a onClick={connectMetamaskMobile}>Open in MetaMask</a>
                      ) : (
                        <a href='https://metamask.io' target='_blank' rel='noreferrer' onClick={closeModal}>
                          Install MetaMask extension
                        </a>
                      )}
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
