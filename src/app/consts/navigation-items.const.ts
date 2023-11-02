export enum NavigationRoutes {
  HOME = '/',
  COLLECTIONS = '/collections',
  HELP = '/help',
  MY_REWARDS = '/my-rewards',
  MY_TOKENS = '/my-tokens',
  MY_QR_CODE = '/my-qr-code'
}

export const navigationItems = [
  { label: 'KOLEKCJE', href: NavigationRoutes.COLLECTIONS },
  { label: 'POMOC', href: NavigationRoutes.HELP },
  { label: 'MOJE TOKENY', href: NavigationRoutes.MY_TOKENS },
  { label: 'MOJE NAGRODY', href: NavigationRoutes.MY_REWARDS },
  { label: 'MÓJ KOD QR', href: NavigationRoutes.MY_QR_CODE }
];

export enum EventNavigationRoutes {
  ABOUT = '/about',
  TOKENS = '/tokens',
  MY_TOKENS = '/my-tokens',
  REWARDS = '/my-rewards',
  GALLERY = '/gallery'
}

export enum HelpNavigationRoutes {
  HOW_TO_CONNECT = '/how-to-connect'
}

export const eventNavigationItems = [
  { label: 'KUP TOKEN', href: EventNavigationRoutes.TOKENS },
  { label: 'GALERIA', href: EventNavigationRoutes.GALLERY },
  { label: 'MOJE TOKENY', href: EventNavigationRoutes.MY_TOKENS, className: 'col-span-1' },
  { label: 'MOJE NAGRODY', href: EventNavigationRoutes.REWARDS, className: 'col-span-1' },
  { label: 'INFORMACJE', href: EventNavigationRoutes.ABOUT }
  // { label: 'BONUS', href: EventNavigationRoutes.ABOUT }
];

export const helpNavigationItems = [{ label: 'JAK PODŁĄCZYć PORTFEL', href: HelpNavigationRoutes.HOW_TO_CONNECT }];
