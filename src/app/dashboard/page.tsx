import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';

import Dashboard from './dashboard';

export const metadata = { title: `Overview | Dashboard | Amisa` } satisfies Metadata;

export interface Budget {
  budget: string;
  profit: string;
}

export default function Page(): React.JSX.Element {
  return <Dashboard />;
}
