'use client';

import { ReactElement, useEffect, useState } from 'react';

const SIZE = 5;
const BASE_SIZE = 5;
const TIME_INTERVAL = 1000 * 60 * 60;

const x = undefined;

const BASE = Array.from({ length: SIZE }, () => Array(SIZE).fill(false)); // Initialize base with 'false'

// const START_DATE = new Date(2024, 2, 29, 22, 3, 0, 0);
const START_DATE = new Date(2024, 4, 8, 9, 0, 0, 0);
const MOCK_DATE = new Date(2024, 2, 25, 0, 0, 1, 0);

export default function ImagesGen(): ReactElement {
  const [iterationNumber, setIterationNumber] = useState(0);
  const [displayBase, setDisplayBase] = useState<Array<Array<number>>>([[]]);

  useEffect(() => {
    const timeDiff = (Date.now() - Date.parse(START_DATE.toString())) / TIME_INTERVAL / 25;
    // let combinationCount = timeDiff;
    console.log(timeDiff);
    let combinationCount = Math.pow(2, BASE_SIZE * BASE_SIZE) - 1237123;
    // let combinationCount = 0;

    function generateCombinations() {
      // Initialize the base array
      const base = [];
      for (let i = 0; i < BASE_SIZE; i++) {
        const row = [];
        for (let j = 0; j < BASE_SIZE; j++) {
          row.push(0);
        }
        base.push(row);
      }

      // Set 1s in the base array from left to right and top to bottom
      let count = combinationCount;
      for (let i = 0; i < BASE_SIZE; i++) {
        for (let j = 0; j < BASE_SIZE; j++) {
          base[i][j] = count % 2;
          count = Math.floor(count / 2);
        }
      }

      setDisplayBase(base);

      // Increment combination count
      combinationCount++;
      setIterationNumber(combinationCount);

      // Stop when all combinations have been generated
      if (combinationCount === Math.pow(2, BASE_SIZE * BASE_SIZE)) {
        clearInterval(interval);
      }
    }

    // Set interval to change the base every second
    const interval = setInterval(generateCombinations, TIME_INTERVAL);
    generateCombinations();
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const timeDiff = Date.now() - Date.parse(START_DATE.toString());
  //     setIterationNumber(Math.floor(timeDiff / 100));
  //   }, 100);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="h-full flex flex-col">
      <h1>Iteration: {iterationNumber}</h1>
      <div className="grid grid-rows-5 grid-cols-5 w-fit self-center">
        {displayBase.map((row, x) =>
          row.map((_, y) => (
            <div
              mark={`${x}_${y}`}
              key={`${x}_${y}`}
              className={`${_ === 1 ? 'bg-red-500' : 'bg-gray-300'} w-16 h-16`}
            ></div>
          ))
        )}
      </div>
    </div>
  );
}
