import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface UserProps {
  filterUser: string;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomersFilters({ filterUser, onFilterChange }: UserProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={filterUser}
        onChange={onFilterChange}
        defaultValue=""
        fullWidth
        placeholder="Search Users"
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
