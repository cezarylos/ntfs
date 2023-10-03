'use client';

import { useHasProvider } from '@/app/hooks/useHasProvider';
import { setIsLoading } from '@/app/store/global/global.slice';
import { useAppDispatch } from '@/app/store/store';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { useQRCode } from 'next-qrcode';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

import axios from 'axios';

const message = 'Zweryfikuj swój adres';

export default function MyQrCode(): ReactElement {
  const { Canvas } = useQRCode();

  const dispatch = useAppDispatch();

  const hasProvider = useHasProvider();

  const { address, connector } = useAccount();

  const [encryptedAddress, setEncryptedAddress] = useState<string>('');

  const parentRef = useRef<HTMLDivElement | null>(null);

  const { data, isSuccess, signMessage } = useSignMessage({
    message
  });

  useEffect((): void => {
    if (!hasProvider || !connector) {
      return;
    }
    const init = async (): Promise<void> => {
      try {
        dispatch(setIsLoading(true));
        signMessage();
      } catch (e) {
        dispatch(setIsLoading(false));
      }
    };
    init().finally();
  }, [address, dispatch, hasProvider, signMessage, connector]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    const init = async (): Promise<void> => {
      try {
        const res = await axios.post('/api/' + EndpointsEnum.GET_MY_QR_CODE, {
          signature: data,
          message,
          address
        });
        setEncryptedAddress(res.data);
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    init().finally();
  }, [address, data, dispatch, isSuccess]);

  return (
    <div className="pb-2" ref={parentRef}>
      <h1 className="text-xl text-white my-4 text-center">{!address && 'Podłącz Portfel żeby zobaczyć QR kod'}</h1>
      {encryptedAddress && (
        <div className={'flex flex-col items-center mt-4'}>
          <Canvas
            text={encryptedAddress}
            options={{
              errorCorrectionLevel: 'M',
              margin: 3,
              scale: 4,
              width: parentRef.current?.clientWidth,
              color: {
                dark: '#4c1d95',
                light: '#FFFFFF'
              }
            }}
            logo={{
              src: '/logo1.gif',
              options: {
                width: ((parentRef.current?.clientWidth || 0) / 4) as number
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
