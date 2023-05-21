'use client';

export const useHasProvider = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window?.ethereum?.isMetaMask;
};
