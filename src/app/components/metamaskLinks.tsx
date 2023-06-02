import React, { ReactElement } from 'react';

const MetamaskLinks = (): ReactElement => {
  return (
    <div
      className="flex flex-col w-full h-auto max-w-md transform overflow-hiddenborder-solid p-3 text-left align-middle">
      <h3 className="text-xl text-white text-center font-medium leading-6">Podłącz Portfel, żeby zobaczyć<br/>
        swoje <span className="text-transparent bg-gradient-to-r bg-clip-text from-cyan-500 to-yellow-500 text-2xl">TOKENY</span></h3>
    </div>
  );
};

export default MetamaskLinks;
