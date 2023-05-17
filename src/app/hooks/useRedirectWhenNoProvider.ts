'use client';
import { redirect } from 'next/navigation';

export const useRedirectWhenNoProvider = (): boolean => {
  const hasProvider = window?.ethereum?.isMetaMask;

  if (!hasProvider) {
    redirect('/homepage');
  }

  return hasProvider;
};
