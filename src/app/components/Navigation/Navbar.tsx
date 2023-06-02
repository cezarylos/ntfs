'use client';

import { navigationItems, NavigationRoutes } from '@/app/consts/navigation-items.const';
import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useMetaMaskConnect } from '@/app/hooks/useMetaMaskConnect';
import { classNames, formatAddress, isMobileDevice } from '@/app/utils';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, ChevronDoubleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactElement, useMemo } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { wallet, isConnecting } = useMetaMask();
  const isMobile = isMobileDevice();
  const onMetaMaskConnect = useMetaMaskConnect();

  const isHomePage = useMemo(() => pathname === NavigationRoutes.HOME, [pathname]);

  const navigation = useMemo(() => {
    if (isHomePage) {
      return [];
    }
    return navigationItems.map(item => ({
      ...item,
      current: pathname === item.href
    }));
  }, [pathname, isHomePage]);

  const onGoBack =
    (close: () => void): (() => void) =>
    (): void => {
      close();
      router.back();
    };

  const renderBackButton = (close: () => void): ReactElement =>
    pathname !== NavigationRoutes.HOME ? (
      <button
        onClick={onGoBack(close)}
        className={classNames(
          'text-yellow-300 rounded-md px-1 py-2 text-base font-medium flex items-center',
          !isMobile ? 'hover:bg-pink-500 hover:text-white' : ''
        )}
      >
        <ChevronDoubleLeftIcon className="block h-6 w-6" aria-hidden="true" />
        <span className="ml-2 relative top-[1px] sm:top-0">Wstecz</span>
      </button>
    ) : (
      <></>
    );

  const onLinkClick =
    (href: string, close: () => void): (() => void) =>
    (): void => {
      close();
      router.push(href);
    };

  return (
    <Disclosure as="nav" className="sticky top-0 z-10 bg-violet-900 drop-shadow-lg">
      {({ open, close }) => (
        <div className="w-full">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                {!!navigation.length && (
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6 text-white" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6 text-white" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                )}
              </div>
              <div className="flex flex-1 items-center justify-center h-full sm:justify-start">
                <Link
                  className="h-8 w-auto flex items-center relative top-[1px] hover:brightness-110"
                  onClick={onLinkClick(NavigationRoutes.HOME, close)}
                  href="#"
                >
                  <Image
                    src={'/logo1.gif'}
                    width={0}
                    height={0}
                    alt={'Logo'}
                    fill={false}
                    priority
                    sizes={'100vw'}
                    style={{ width: 'auto', height: '3rem' }}
                  />
                </Link>
                {!!navigation.length && (
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {renderBackButton(close)}
                      {navigation.map(({ label, href, current }) => (
                        <a
                          onClick={onLinkClick(href, close)}
                          key={label}
                          className={classNames(
                            current
                              ? 'bg-violet-950 text-white'
                              : 'text-white hover:bg-pink-500 hover:text-white cursor-pointer',
                            'rounded-md px-3 py-2 text-sm leading-none font-medium flex items-center'
                          )}
                          aria-current={current ? 'page' : undefined}
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {wallet.accounts.length > 0 ? (
                  <p className={'text-white text-sm font-medium font-inter'}>{formatAddress(wallet.accounts[0])}</p>
                ) : (
                  <button
                    className="rounded-md text-purple-950 bg-pink-400 font-semibold p-1 text-sm hover:brightness-110 font-inter w-32 animate-pulse"
                    onClick={onMetaMaskConnect}
                  >
                    {isConnecting ? <span className="animate-pulse">Łączenie...</span> : 'Podłącz Portfel'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden absolute w-full bg-violet-900 p-1">
            {renderBackButton(close)}
            {navigation.map(({ label, href, current }) => (
              <a key={label} href="#" onClick={onLinkClick(href, close)}>
                <Disclosure.Button
                  as="a"
                  className={classNames(
                    current ? 'bg-violet-950 text-white' : 'text-white hover:bg-pink-500 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={current ? 'page' : undefined}
                >
                  {label}
                </Disclosure.Button>
              </a>
            ))}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
