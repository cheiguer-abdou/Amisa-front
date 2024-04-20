import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface ProductProps {
  filterProduct: string;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomersFilters({ filterProduct, onFilterChange }: ProductProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={filterProduct}
        onChange={onFilterChange}
        defaultValue=""
        fullWidth
        placeholder="Search product"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
    </Card>
  );
}
