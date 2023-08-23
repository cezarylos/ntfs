'use client';

import { useMetaMaskConnect } from '@/app/hooks/useMetaMaskConnect';
import { classNames } from '@/app/utils';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import React, { useEffect, useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';

import styles from './HowTo.module.scss';

interface Props {
  description: string;
}

const BUTTON_ID = 'connect';

const buttonToRender = (
  <div className="w-full flex justify-center mb-4 mt-[-0.5rem]">
    <br />
    <button
      id={BUTTON_ID}
      className="rounded-md shadow-xl text-white bg-pink-500 font-semibold p-2 text-base hover:brightness-110 font-inter w-1/2"
    >
      Kliknij mnie!
    </button>
  </div>
);

const REPLACE_TEMPLATE = '${insertButton}';
export default function HowTo({ description }: Props) {
  const onMetaMaskConnect = useMetaMaskConnect();
  const ref = React.useRef<HTMLDivElement>(null);

  const updatedDescription = useMemo((): string => {
    const content = marked.parse(description || '', { mangle: false, headerIds: false });
    const buttonString = ReactDOMServer.renderToString(buttonToRender);
    return content.replace(REPLACE_TEMPLATE, buttonString);
  }, [description]);

  useEffect((): (() => void) => {
    const handleClick = (): void => {
      onMetaMaskConnect();
    };

    const button = ref.current?.querySelector(`#${BUTTON_ID}`);
    if (button) {
      button.addEventListener('click', handleClick);
    }

    // Cleanup function
    return (): void => {
      if (button) {
        button.removeEventListener('click', handleClick);
      }
    };
  }, [onMetaMaskConnect]);

  return (
    <div
      ref={ref}
      className={classNames('mt-4 text-[1.2rem] text-left pb-4', styles.description)}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(updatedDescription)
      }}
    />
  );
}
