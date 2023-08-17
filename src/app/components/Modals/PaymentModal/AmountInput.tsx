import { debounce } from 'lodash';
import React, { ChangeEvent, Dispatch, ReactElement, useCallback, useEffect, useState } from 'react';

interface Props {
  amount: number;
  setAmount: Dispatch<number>;
  maxAmount: number;
}

export default function AmountInput({ amount, setAmount, maxAmount }: Props): ReactElement {
  const [value, setValue] = useState(amount);

  const handleIncrement = useCallback((): void => {
    if (value < maxAmount) {
      setValue(value + 1);
    }
  }, [maxAmount, value]);

  const handleDecrement = useCallback((): void => {
    if (value > 1) {
      setValue(value - 1);
    }
  }, [value]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const inputValue = event.target.value;
      if (inputValue === '') {
        setValue(1);
      }
      if (parseInt(inputValue) >= 1 && parseInt(inputValue) <= maxAmount) {
        setValue(parseInt(inputValue));
      }
    },
    [maxAmount, setValue]
  );

  useEffect(() => {
    const updateAmount = debounce(() => {
      setAmount(value);
    }, 500);

    updateAmount();

    // Cleanup the debounced function
    return () => {
      updateAmount.cancel();
    };
  }, [setAmount, value]);

  const isIncrementDisabled = value === maxAmount;
  const isDecrementDisabled = value === 1;

  return (
    <div className="flex flex-row h-10 w-3/4 rounded-lg relative bg-transparent mt-2 mb-2 mx-auto">
      <button
        data-action="decrement"
        className={`bg-pink-500 text-white ${
          isDecrementDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-400'
        } h-full w-20 rounded-l cursor-pointer outline-none disabled:bg-pink-800`}
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
      >
        <span className="m-auto text-2xl font-thin">−</span>
      </button>
      <input
        type="text"
        className="focus:outline-none text-center w-full bg-pink-400 text-white font-semibold text-md md:text-base cursor-default flex items-center outline-none"
        name="custom-input-number"
        value={value}
        readOnly
        onChange={handleInputChange}
      />
      <button
        data-action="increment"
        className={`bg-pink-500 text-white ${
          isIncrementDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-400'
        } h-full w-20 rounded-r cursor-pointer outline-none disabled:bg-pink-800`}
        onClick={handleIncrement}
        disabled={isIncrementDisabled}
      >
        <span className="m-auto text-2xl font-thin">+</span>
      </button>
    </div>
  );
}
