export enum NavigationRoutes {
  HOME = '/home',
  EVENTS = '/events',
  HOW_TO = '/how-to',
  MY_TICKETS = '/my-tickets',
  MY_TOKENS = '/my-tokens'
}

export const navigationItems = [
  { label: 'EVENTY', href: NavigationRoutes.EVENTS },
  { label: 'JAK TO DZIAŁA', href: NavigationRoutes.HOW_TO },
  { label: 'MOJE TOKENY', href: NavigationRoutes.MY_TOKENS },
  { label: 'MOJE NAGRODY', href: NavigationRoutes.MY_TICKETS }
];

export enum EventNavigationRoutes {
  ABOUT = '/about',
  TOKENS = '/tokens',
  TICKETS = '/my-tickets'
}

export const eventNavigationItems = [
  { label: 'TOKENY', href: EventNavigationRoutes.TOKENS },
  { label: 'MOJE NAGRODY', href: EventNavigationRoutes.TICKETS },
  { label: 'O EVENCIE', href: EventNavigationRoutes.ABOUT }
];
