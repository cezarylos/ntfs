import { styleTileSets } from '@/app/consts/style-tile-sets';
import { ModalInterface } from '@/app/typings/common.typings';
import { classNames } from '@/app/utils';
import { Dialog, Transition } from '@headlessui/react';
import { marked } from 'marked';
import React, { Fragment, ReactElement } from 'react';
import Image from 'next/image';

interface Props extends ModalInterface {
  openSeaUrl: string;
  tokenName: string;
  tokenUrl: string;
  tokenDescription: string;
}

export default function TokenModal({
  isOpen,
  setIsOpen,
  openSeaUrl,
  tokenName,
  tokenUrl,
  tokenDescription
}: Props): ReactElement {
  function closeModal() {
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
                  <Dialog.Title as="h3" className="text-3xl text-center font-medium leading-6 text-purple-950">
                    <span
                      className={classNames(
                        `before:block before:absolute ${styleTileSets[0].accent} relative inline-block`
                      )}
                    >
                      <h1 className={classNames('text-3xl font-bold mb-2 text-purple-900 outline-none relative')}>
                        {tokenName}
                      </h1>
                    </span>
                  </Dialog.Title>
                  <div>
                    <Image
                      src={tokenUrl}
                      alt={tokenName}
                      className="max-w-[60%] xl:max-w-[50%] mx-auto mt-2 rounded-md shadow-lg"
                      width={0}
                      height={0}
                      fill={false}
                      priority
                      sizes={'100vw'}
                      style={{ width: '100%', height: '100%' }}
                    />
                    <div
                      className="text-base mt-4 text-center font-inter md:w-[60%] m-auto"
                      dangerouslySetInnerHTML={{
                        __html: marked
                          .parse(tokenDescription || '', { mangle: false, headerIds: false })
                          .replace(
                            '<a ',
                            '<a target="_blank" class="underline text-purple-900 font-mogra cursor-pointer outline-none" '
                          )
                      }}
                    />
                  </div>
                  <div className="mt-1">
                    <a
                      href={openSeaUrl}
                      target="_blank"
                      className="m-auto mt-2 p-2 w-3/4 font-inter justify-center bg-pink-500 flex item-center text-white px-3 py-2 text-sm font-medium shadow-xl rounded-md hover:brightness-110"
                    >
                      Obczaj na OpenSea
                    </a>
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
