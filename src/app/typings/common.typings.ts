export interface ModalInterface {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export enum SocialLinksEnum {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  DISCORD = 'discord'
}

export const PAYMENT_STATUS_STRING = 'payment_status';
export const SUCCESS_STRING = 'success';
export const WALLET_CONNECTION_LAG = 'Połączenie z portfelem zamula?\nSpróbuj odswieżyć stronę';
export const WALLET_COLLECTION_LAG_THRESHOLD = 3000;
