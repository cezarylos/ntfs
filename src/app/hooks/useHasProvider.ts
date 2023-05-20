'use client';

export const useHasProvider = (): boolean => {
  return window?.ethereum?.isMetaMask;
};
