export interface ModalInterface {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export enum SocialLinksEnum {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  DISCORD = 'discord'
}
