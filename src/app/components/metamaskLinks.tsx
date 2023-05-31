import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useMetaMaskConnect } from '@/app/hooks/useMetaMaskConnect';
import React, { ReactElement } from 'react';

const MetamaskLinks = (): ReactElement => {
  const onMetaMaskConnect = useMetaMaskConnect();
  const { isConnecting } = useMetaMask();

  return (
    <div className="flex flex-col w-full h-auto max-w-md transform overflow-hiddenborder-solid p-6 text-left align-middle">
      <h3 className="text-xl text-center font-medium leading-6 text-gray-900">Ej Ziomek, najpierw podłącz poftfel</h3>
      <button
        className="text-lg rounded-md text-white bg-green-800 p-2 mt-4 mx-auto w-1/2 hover:brightness-110 font-inter"
        onClick={onMetaMaskConnect}
      >
        {isConnecting ? <span className="animate-pulse">Łączenie...</span> : 'Podłącz Portfel'}
      </button>
    </div>
  );
};

export default MetamaskLinks;
