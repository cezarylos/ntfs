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
