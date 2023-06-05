export enum NavigationRoutes {
  HOME = '/',
  EVENTS = '/events',
  HOW_TO = '/how-to',
  MY_REWARDS = '/my-rewards',
  MY_TOKENS = '/my-tokens'
}

export const navigationItems = [
  { label: 'EVENTY', href: NavigationRoutes.EVENTS },
  { label: 'JAK TO DZIAŁA', href: NavigationRoutes.HOW_TO },
  { label: 'MOJE TOKENY', href: NavigationRoutes.MY_TOKENS },
  { label: 'MOJE NAGRODY', href: NavigationRoutes.MY_REWARDS }
];

export enum EventNavigationRoutes {
  ABOUT = '/about',
  TOKENS = '/tokens',
  REWARDS = '/my-rewards'
}

export const eventNavigationItems = [
  { label: 'ZGARNIJ TOKEN', href: EventNavigationRoutes.TOKENS },
  { label: 'ZASADY', href: EventNavigationRoutes.ABOUT },
  { label: 'O EVENCIE', href: EventNavigationRoutes.ABOUT },
  { label: 'MOJE NAGRODY', href: EventNavigationRoutes.REWARDS }
];
