import { useRouter } from 'next/navigation';

export const useRedirectWhenNoProvider = (): boolean => {
  const hasProvider = window?.ethereum?.isMetaMask;
  const router = useRouter();

  if (!hasProvider) {
    router.replace('/');
  }

  return !!hasProvider;
}
