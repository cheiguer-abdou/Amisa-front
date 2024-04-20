import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'dashboard', title: 'Dashboard', href: paths.dashboard.overview, icon: 'chart-pie', role: 'Admin' },
  { key: 'produits', title: 'Produits', href: paths.dashboard.produits, icon: 'users', role: 'User' },
  { key: 'users', title: 'Users', href: paths.dashboard.users, icon: 'users', role: 'Admin' },
  { key: 'clients', title: 'Clients', href: paths.dashboard.clients, icon: 'users', role: 'User' },
  { key: 'orders', title: 'Orders', href: paths.dashboard.orders, icon: 'plugs-connected', role: 'User' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user', role: 'User' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
