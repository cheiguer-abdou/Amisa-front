import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';

import Orders from './orders';

export const metadata = { title: `Orders | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <Orders />;
}
