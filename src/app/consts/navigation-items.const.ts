export enum NavigationRoutes {
  HOME = '/',
  EVENTS = '/events',
  HELP = '/help',
  MY_REWARDS = '/my-rewards',
  MY_TOKENS = '/my-tokens'
}

export const navigationItems = [
  { label: 'EVENTY', href: NavigationRoutes.EVENTS },
  { label: 'POMOC', href: NavigationRoutes.HELP },
  { label: 'MOJE TOKENY', href: NavigationRoutes.MY_TOKENS },
  { label: 'MOJE NAGRODY', href: NavigationRoutes.MY_REWARDS }
];

export enum EventNavigationRoutes {
  ABOUT = '/about',
  TOKENS = '/tokens',
  REWARDS = '/my-rewards'
}

export enum HelpNavigationRoutes {
  HOW_TO_CONNECT = '/how-to-connect'
}

export const eventNavigationItems = [
  { label: 'ZGARNIJ TOKEN', href: EventNavigationRoutes.TOKENS },
  { label: 'O EVENCIE', href: EventNavigationRoutes.ABOUT },
  { label: 'MOJE NAGRODY', href: EventNavigationRoutes.REWARDS },
  { label: 'BONUS', href: EventNavigationRoutes.ABOUT }
];

export const helpNavigationItems = [
  { label: 'JAK PODŁĄCZYć PORTFEL', href: HelpNavigationRoutes.HOW_TO_CONNECT }
];
