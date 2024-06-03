'use client';

import * as React from 'react';
import { useEffect, useState, type ChangeEvent } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Input, Modal, Stack, Typography } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { type AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { unknown } from 'zod';

import { CustomersFilters } from '@/components/dashboard/client/customers-filters';
import { CustomersTable } from '@/components/dashboard/client/customers-table';
import type { Client } from '@/components/dashboard/client/customers-table';
import { RHFTextField } from '@/components/hook-form';
import FormProvider from '@/components/hook-form/FormProvider';

import axios from '../../axios-config';

interface FormValuesProps extends Omit<Client, 'avatar' | 'createdAt'> {}

export default function Clients(): React.JSX.Element {
  const [clients, setClients] = useState<Client[]>([]);

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('phone is required'),
  });
  const defaultValues = {
    id: '',
    name: '',
    phone: '',
    createdAt: '',
  };

  // Set up form methods with Yup resolver
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    // Provide default values if needed
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [selectedFile, setSelectedFile] = useState<File>();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    // You can implement your upload logic here
    console.log('Selected file:', selectedFile);
  };

  const [open, setOpen] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    borderRadius: 2,
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const formData = new FormData();

      if (selectedFile) formData.append('image', selectedFile);
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string' || value instanceof Blob) {
          formData.append(key, value);
        } else {
          console.error(`Invalid type for ${key}`);
        }
      });

      const response: AxiosResponse<Client> = await axios.post('/clients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure proper content type for file uploads
        },
      });

      // Handle successful upload
      const newProduct: Client = response.data; // Assuming the response contains the newly created product
      setClients((prevProducts) => [newProduct, ...prevProducts]);
      console.log(response.data);
      handleClose();
    } catch (error) {
      // Handle error
      console.error('Error uploading product:', error);
    } finally {
      reset(defaultValues);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Clients</Typography>
          {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                Import
              </Button>
              <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                Export
              </Button>
            </Stack> */}
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpen}>
            Ajouter
          </Button>
        </div>
      </Stack>
      <CustomersTable />

      {open ? (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card>
            <Box sx={style}>
              <h2 id="modal-modal-title" style={{ textAlign: 'center' }}>
                Ajouter Client
              </h2>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={18} md={18}>
                    <Box
                      rowGap={4}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                      }}
                    >
                      <Stack spacing={1}>
                        <RHFTextField name="name" label="Name" />
                      </Stack>
                      <Stack spacing={1}>
                        <RHFTextField name="phone" label="Phone" />
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <br />
                  <br />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton
                      type="submit"
                      style={{ backgroundColor: 'rgb(0, 0, 67)' }}
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Add
                    </LoadingButton>
                  </div>
                </Grid>
              </FormProvider>
            </Box>
          </Card>
        </Modal>
      ) : null}
    </Stack>
  );
}

function applyPagination(rows: Client[], page: number, rowsPerPage: number): Client[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
