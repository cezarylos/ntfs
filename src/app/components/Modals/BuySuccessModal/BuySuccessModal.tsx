import { styleTileSets } from '@/app/consts/style-tile-sets';
import { ModalInterface } from '@/app/typings/common.typings';
import { classNames } from '@/app/utils';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import React, { Fragment, ReactElement } from 'react';

interface Props extends ModalInterface {
  collectionImage: string;
}

export default function BuySuccessModal({ isOpen, setIsOpen, collectionImage }: Props): ReactElement {
  function closeModal(): void {
    setIsOpen(false);
  }

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
                  <XMarkIcon
                    onClick={closeModal}
                    className="block h-8 w-8 text-purple-900 float-right self-end cursor-pointer hover:brightness-110 absolute top-2 right-2"
                    aria-hidden="true"
                  />
                  <Dialog.Title as="h3" className="text-3xl text-center font-medium leading-6 text-purple-950 mt-2">
                    <span
                      className={classNames(
                        `before:block before:absolute ${styleTileSets[0].accent} relative inline-block`
                      )}
                    >
                      <h1 className={classNames('text-3xl font-bold mb-2 text-purple-900 outline-none relative')}>
                        Beng! Gratulacje!
                      </h1>
                    </span>
                  </Dialog.Title>
                  <div className="flex flex-col mt-4 mb-6">
                    <Image
                      src={collectionImage}
                      alt={'collectionImage'}
                      width={0}
                      height={0}
                      fill={false}
                      priority
                      sizes={'100vw'}
                      style={{ width: '100%', height: '100%' }}
                      className={classNames('max-w-[calc(50%)] h-auto m-auto rounded-md drop-shadow-xl outline-none')}
                    />
                    <p className="text-xl text-center font-medium leading-6 text-purple-900 mt-4">
                      Twój token już do Ciebie leci!
                    </p>
                    <p className="text-purple-600 text-md mt-4 text-center font-inter">
                      *** Jeśli po zamknięciu tego okna, nie widzisz zakupionych tokenów - odswież stronę ***
                    </p>
                  </div>
                  <button className="mt-1" onClick={closeModal}>
                    <span className="m-auto mt-2 p-2 w-3/4 font-inter justify-center bg-pink-200 flex item-center text-purple-900 px-3 py-2 text-lg md:text-sm font-medium shadow-xl rounded-md hover:brightness-110 cursor-pointer">
                      Zamknij
                    </span>
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
