import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';

import Clients from './clients';

export const metadata = { title: `Clients | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <Clients />;
}
