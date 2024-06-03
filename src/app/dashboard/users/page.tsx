import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';

import Users from './users';

export const metadata = { title: `Users | Dashboard | Amisa` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <Users />;
}
