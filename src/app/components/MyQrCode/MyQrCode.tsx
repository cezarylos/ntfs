'use client';

import { useHasProvider } from '@/app/hooks/useHasProvider';
import { useMetaMask } from '@/app/hooks/useMetaMask';
import { setIsLoading } from '@/app/store/global/global.slice';
import { useAppDispatch } from '@/app/store/store';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { useQRCode } from 'next-qrcode';
import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import axios from 'axios';

export default function MyQrCode(): ReactElement {
  const { Canvas } = useQRCode();

  const dispatch = useAppDispatch();

  const {
    wallet: { accounts }
  } = useMetaMask();

  const hasProvider = useHasProvider();

  const [encryptedAddress, setEncryptedAddress] = useState<string>('');

  const address = useMemo((): string => accounts?.[0], [accounts]);

  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect((): void => {
    if (!hasProvider || !accounts?.length) {
      return;
    }
    const init = async (): Promise<void> => {
      try {
        dispatch(setIsLoading(true));

        const message = 'Zweryfikuj swój adres';

        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address]
        });

        const res = await axios.post('/api/' + EndpointsEnum.GET_MY_QR_CODE, {
          signature,
          message,
          address
        });
        setEncryptedAddress(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    init().finally();
  }, [accounts, address, dispatch, hasProvider]);

  return (
    <div className="pb-2" ref={parentRef}>
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
                width: (parentRef.current?.clientWidth / 4) as number
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
