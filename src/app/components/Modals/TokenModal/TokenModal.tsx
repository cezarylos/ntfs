import NftMedia from '@/app/components/NftMedia/NftMedia';
import { styleTileSets } from '@/app/consts/style-tile-sets';
import { ModalInterface } from '@/app/typings/common.typings';
import { checkIfImageIsGift, classNames } from '@/app/utils';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import Image from 'next/image';
import React, { Fragment, ReactElement, useEffect, useRef } from 'react';

interface Props extends ModalInterface {
  openSeaUrl: string;
  tokenName: string;
  tokenUrl: string;
  tokenDescription: string;
  contractAddress: string;
  tokenId: string;
}

export default function TokenModal({
  isOpen,
  setIsOpen,
  openSeaUrl,
  tokenName,
  tokenUrl,
  tokenDescription,
  contractAddress,
  tokenId
}: Props): ReactElement {
  const containerRef = useRef<HTMLDivElement | null>();
  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
    }
  }, [isOpen]);

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
                        {tokenName}
                      </h1>
                    </span>
                  </Dialog.Title>
                  <div>
                    <NftMedia
                      imageSrc={tokenUrl}
                      style={{ width: '100%', height: '100%' }}
                      className="max-w-[100%] xl:max-w-[70%] mx-auto mt-2 rounded-md shadow-lg pointer-events-none"
                      isGif={checkIfImageIsGift(tokenUrl)}
                      isAutoPlay
                    />
                    <div
                      className="text-base md:text-sm mt-4 text-center font-inter m-auto mb-2"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          marked
                            .parse(tokenDescription || '', { mangle: false, headerIds: false })
                            .replace(
                              '<a ',
                              '<a target="_blank" class="underline text-purple-900 font-mogra cursor-pointer outline-none" '
                            )
                        )
                      }}
                    />
                  </div>
                  <div className="text-center mt-2">
                    <p className="mb-0.5 text-purple-900">Adres kontraktu:</p>
                    <p className="font-inter break-words">{contractAddress}</p>
                  </div>
                  <div className="text-center mt-2">
                    <p className="mb-0.5 text-purple-900">Token ID:</p>
                    <p className="font-inter break-words">{tokenId}</p>
                  </div>
                  <div className="mt-1">
                    <a
                      href={openSeaUrl}
                      target="_blank"
                      className="m-auto mt-2 p-2 w-3/4 font-inter justify-center bg-pink-500 flex item-center text-white px-3 py-2 text-lg md:text-sm font-medium shadow-xl rounded-md hover:brightness-110 outline-none"
                    >
                      Obczaj na OpenSea
                    </a>
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
