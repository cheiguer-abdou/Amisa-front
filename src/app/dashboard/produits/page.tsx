import * as React from 'react';
// import { useClient } from 'next/client';
import type { Metadata } from 'next';

// import dynamic from 'next/dynamic';

// import { Box } from '@mui/material';
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
// import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
// import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
// import dayjs from 'dayjs';

import { config } from '@/config';

import Produits from './produits';

// import { CustomersFilters } from '@/components/dashboard/produit/customers-filters';
// import { CustomersTable } from '@/components/dashboard/produit/customers-table';
// import type { Customer } from '@/components/dashboard/produit/customers-table';

// const Modal = dynamic(() => import('@mui/material/Modal'), { ssr: false });

export const metadata = { title: `Produits | Dashboard | Amisa` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  // useClient();
  return <Produits />;
}
