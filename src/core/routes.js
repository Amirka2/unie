import {
  ArrowUpIcon,
  QuestionIcon,
  ReceiptIcon,
  SackDollarIcon,
  UserHeadsetIcon,
  UserIcon
} from "@/shared/ui";

export const ROUTES = {
  home: {
    href: '/',
    label: 'Home'
  },
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
  },
  profile: {
    Icon: UserIcon,
    href: '/profile',
    label: 'My account'
  },
  events: {
    Icon: ArrowUpIcon,
    href: '/events',
    label: 'Events'
  },
  withdraw: {
      href: '/balance/withdraw',
      label: 'Withdraw'
  },
  deposit: {
      href: '/balance/deposit',
      label: 'Deposit'
  },
  signUp: {
      href: '/auth/sign-up',
      label: 'Sign Up'
  },
  signIn: {
      href: '/auth/sign-in',
      label: 'Sign In'
  },
  tickets: {
    href: '/tickets',
    label: 'Tickets',
    ownList: {
      Icon: ReceiptIcon,
      href: '/tickets/own',
      label: 'My tickets'
    },
    create: {
      Icon: SackDollarIcon,
      href: '/tickets/create',
      label: 'Cell tickets'
    }
  },
  support: {
    Icon: UserHeadsetIcon,
    href: '/support',
    label: 'Support'
  },
  FAQ: {
    Icon: QuestionIcon,
    href: '/FAQ',
    label: 'FAQ'
  }
}

export const PROTECTED_ROUTES = [
  ROUTES.profile,
  ROUTES.deposit,
  ROUTES.withdraw,
  ROUTES.tickets.ownList,
];

export const PUBLIC_ROUTES = [
  ROUTES.home,
  ROUTES.auth.signIn,
  ROUTES.auth.signUp,
  ROUTES.events,
  ROUTES.tickets.create,
  ROUTES.support,
  ROUTES.FAQ,
];

export const AUTHORIZED_ROUTES = [
  ...PROTECTED_ROUTES,
  ROUTES.home,
  ROUTES.events,
];

export const ALL_ROUTES = [
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES
];
