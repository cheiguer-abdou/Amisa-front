'use client';

// import { resolve } from 'path';
import React, { useEffect, useState, type ChangeEvent } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Grid, Input, Modal, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
// import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { type AxiosResponse } from 'axios';
// import dayjs from 'dayjs';
// import { FileUpload } from 'primereact/fileupload';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { CustomersFilters } from '@/components/dashboard/produit/customers-filters';
import { CustomersTable, type Produit } from '@/components/dashboard/produit/customers-table';
import { RHFTextField } from '@/components/hook-form';
import FormProvider from '@/components/hook-form/FormProvider';
import { useTable } from '@/components/table';

import axios from '../../axios-config';

interface FormValuesProps extends Produit {}

export default function Produits() {
  const [products, setProducts] = useState<Produit[]>([]);

  // Define Yup schema to validate form values
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    quantity: Yup.string().required('Quantity is required'),
    initPrice: Yup.string().required('Price Initial is required'),
    image: Yup.mixed().nullable(),
    price: Yup.string().required('Price is required'),
  });
  const defaultValues: Produit = {
    id: '',
    name: '',
    image: null,
    description: '',
    quantity: '',
    initPrice: '',
    price: '',
    created_at: '',
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

  // useClient();

  // const paginatedCustomers = applyPagination(products, page, rowsPerPage);
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

  const onSubmit = async (data: Produit) => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const response: AxiosResponse<Produit> = await axios.post('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure proper content type for file uploads
          },
        });

        // Handle successful upload
        const newProduct: Produit = response.data; // Assuming the response contains the newly created product
        setProducts((prevProducts) => [newProduct, ...prevProducts]);
        console.log(response.data);
      } else {
        // Handle case where no file is selected
        console.error('No file selected');
      }
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
          <Typography variant="h4">Products</Typography>
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
            Add
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
                Add Product
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
                        <RHFTextField name="name" label="Title" />
                      </Stack>
                      <Stack spacing={1}>
                        <RHFTextField name="description" label="Description" />
                      </Stack>
                      <Stack spacing={1}>
                        <RHFTextField name="quantity" label="Quantity" />
                      </Stack>
                      <Stack spacing={1}>
                        <RHFTextField name="initPrice" label="Initial Price" />
                      </Stack>
                      <Stack spacing={1}>
                        <RHFTextField name="price" label="Price" />
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Stack spacing={1}>
                      <Button onClick={handleUpload} variant="contained" color="secondary">
                        Upload Image
                        <Input
                          name="image"
                          type="file"
                          onChange={handleFileChange}
                          inputProps={{ accept: '.jpeg,.jpg' }}
                          style={{ opacity: '0', width: '100%', height: '100%', position: 'absolute' }}
                        />
                      </Button>
                    </Stack>
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
                      {isSubmitting ? 'Adding...' : 'Add'}
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
