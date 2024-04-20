'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, Card, Grid, Modal, Stack, TextField, Typography } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import axios, { AxiosResponse } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { Client } from '@/components/dashboard/client/customers-table';
import { CustomersFilters } from '@/components/dashboard/order/customers-filters';
import { CustomersTable, Order } from '@/components/dashboard/order/customers-table';
import { Produit } from '@/components/dashboard/produit/customers-table';
import { RHFTextField } from '@/components/hook-form';
import FormProvider from '@/components/hook-form/FormProvider';

interface FormValuesProps extends Order {}

export default function Orders(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Produit[]>([]);
  const [client, setClient] = useState<Client>();
  const [product, setProduct] = useState<Produit>();
  const [inputClient, setInputClient] = useState('');
  const [inputProduct, setInputProduct] = useState('');
  const NewUserSchema = Yup.object().shape({
    quantity: Yup.number().typeError('Quantity must be a number').required('Quantity is required'),
    client: Yup.object().shape({
      name: Yup.string().required("Client's name is required"),
    }),
    product: Yup.object().shape({
      name: Yup.string().required("Product's name is required"),
    }),
  });
  const [selectedOrder, setSelectedOrder] = useState<Order>({
    id: '',
    product: {
      id: '',
      image: null,
      name: '',
      description: '',
      initPrice: '',
      price: '',
      quantity: '',
      created_at: '',
    },
    client: {
      id: '',
      name: '',
      phone: '',
      created_at: '',
    },
    quantity: 0,
    created_at: '',
  });

  // Set up form methods with Yup resolver
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    // Provide default values if needed
    defaultValues: selectedOrder,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

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

  useEffect(() => {
    const searchClient = () => {
      try {
        axios
          .get(`/c/search?keyword=${inputClient}&page=1`)
          .then((res: AxiosResponse<AxiosResponse<Client[]>>) => {
            setClients(res.data.data);
          })
          .catch((e: unknown) => console.log(e));
      } catch (error) {
        console.error('Error uploading Order:', error);
      }
    };

    const searchProduct = () => {
      try {
        axios
          .get(`/p/search?keyword=${inputProduct}&page=1`)
          .then((res: AxiosResponse<AxiosResponse<Produit[]>>) => {
            setProducts(res.data.data);
          })
          .catch((e: unknown) => console.log(e));
      } catch (error) {
        console.error('Error uploading Order:', error);
      }
    };
    if (inputClient !== '') searchClient();
    if (inputProduct !== '') searchProduct();
  }, [inputClient, inputProduct]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: Order) => {
    if (product && client) {
      const OrderData = {
        product_id: product.id,
        client_id: client.id,
        quantity: data.quantity,
      };

      try {
        const response: AxiosResponse<AxiosResponse<Order>> = await axios.post('/order', OrderData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure proper content type for file uploads
          },
        });

        handleClose();
      } catch (error) {
        // Handle error
        console.error('Error uploading order:', error.response.data.message);
      } finally {
        reset(selectedOrder);
      }
    }
  };

  const handleInputClientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputClient(event.target.value);
  };

  const handleInputProductChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputProduct(event.target.value);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Orders</Typography>
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
                Add Order
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
                        <Controller
                          name="client.name"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Autocomplete
                              size="medium"
                              style={{ width: '100%' }}
                              freeSolo
                              options={clients.map((act) => act.name)}
                              value={field.value}
                              getOptionLabel={(option) => option}
                              onChange={(event, value) => {
                                const selectedClient = clients.find((c) => c.name === value);
                                if (selectedClient) {
                                  setClient(selectedClient); // Update client state with the selected client object
                                }
                                field.onChange(value);
                                if (value) setInputClient(value);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  name="inputClient"
                                  onChange={handleInputClientChange}
                                  {...params}
                                  label="search client..."
                                />
                              )}
                            />
                          )}
                        />
                      </Stack>
                      <Stack spacing={1}>
                        <Controller
                          name="product.name"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Autocomplete
                              size="medium"
                              style={{ width: '100%' }}
                              freeSolo
                              options={products.map((act) => act.name)}
                              value={field.value}
                              getOptionLabel={(option) => option}
                              onChange={(event, value) => {
                                const selectedProduct = products.find((p) => p.name === value);
                                if (selectedProduct) {
                                  setProduct(selectedProduct); // Update client state with the selected client object
                                }
                                field.onChange(value);
                                if (value) setInputProduct(value);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  name="inputProduct"
                                  onChange={handleInputProductChange}
                                  {...params}
                                  label="search product..."
                                />
                              )}
                            />
                          )}
                        />
                      </Stack>
                      <Stack spacing={1}>
                        <RHFTextField name="quantity" label="Quantity" />
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
