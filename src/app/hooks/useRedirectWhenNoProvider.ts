import { useMetaMask } from '@/app/hooks/useMetaMask';
import { useRouter } from 'next/navigation';

export const useRedirectWhenNoProvider = (): boolean => {
  const { hasProvider } = useMetaMask();
  const router = useRouter();

  if (!hasProvider) {
    router.replace('/');
  }

  return !!hasProvider;
}
