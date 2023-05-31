import { ModalInterface } from '@/app/typings/common.typings';
import { Dialog, Transition } from '@headlessui/react';
import { marked } from 'marked';
import React, { Fragment, ReactElement } from 'react';

interface Props extends ModalInterface {
  id: string;
  openSeaUrl: string;
  tokenName: string;
  tokenUrl: string;
  tokenDescription: string;
}

export default function TokenModal({
  id,
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
                <Dialog.Panel className="w-full h-auto max-w-md transform overflow-hidden rounded-2xl bg-orange-200 border-2 border-red-600 border-solid p-6 text-left align-middle shadow-3xl transition-all">
                  <Dialog.Title as="h3" className="text-3xl text-center font-medium leading-6 text-gray-900">
                    {tokenName}
                  </Dialog.Title>
                  <div className="mt-2">
                    <img
                      src={tokenUrl}
                      alt={tokenName}
                      className="max-w-[60%] xl:max-w-[50%] mx-auto mt-2 rounded-md shadow-lg shadow-cyan-500/50"
                    />
                    <div
                      className="text-sm text-gray-500 mt-4"
                      dangerouslySetInnerHTML={{
                        __html: marked
                          .parse(tokenDescription, { mangle: false, headerIds: false })
                          .replace('<a ', '<a target="_blank" class="text-blue-500 cursor-pointer outline-0" ')
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <a
                      href={openSeaUrl}
                      target="_blank"
                      className="w-full inline-flex mx-auto font-inter justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
