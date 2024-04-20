'use client';

import * as React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';
import axios from '@/app/axios-config';
import { yupResolver } from '@hookform/resolvers/yup';
import { Delete, Edit } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  AutocompleteInputChangeReason,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useSelection } from '@/hooks/use-selection';
import FormProvider, { RHFTextField } from '@/components/hook-form';
import Iconify from '@/components/iconify';
import { useTable } from '@/components/table';

import { Client } from '../client/customers-table';
import { Product } from '../overview/latest-products';
import { Produit } from '../produit/customers-table';
import { CustomersFilters } from './customers-filters';

function noop(): void {
  // do nothing
}

export interface Order {
  id: string;
  client: Client;
  product: Produit;
  quantity: number;
  created_at: string;
}

export function CustomersTable(): React.JSX.Element {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    // selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterOrder, setFilterOrder] = useState('');
  const [inputClient, setInputClient] = useState('');
  const [inputProduct, setInputProduct] = useState('');
  const [clientError, setClientError] = useState('');
  const [productError, setProductError] = useState('');
  const rowIds = React.useMemo(() => {
    return orders.map((customer) => customer.id);
  }, [orders]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < orders.length;
  const selectedAll = orders.length > 0 && selected?.size === orders.length;

  const [total, setTotal] = useState(0);
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

  // const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  // const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  // const selectedAll = rows.length > 0 && selected?.size === rows.length;

  useEffect(() => {
    const fetchData = () => {
      axios
        .get('/orders', {
          params: {
            page: page + 1,
            size: rowsPerPage,
          },
        } as unknown as Record<string, string>)
        .then((res: AxiosResponse<AxiosResponse<Order[]>>) => {
          setOrders(res.data.data);
          console.log(res.data);
          setTotal(res.data.total);
        })
        .catch((e: unknown) => console.log(e));
    };
    fetchData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const searchOrder = () => {
      try {
        axios
          .get(`/o/search?keyword=${filterOrder}&page=1`)
          .then((res: AxiosResponse<AxiosResponse<Order[]>>) => {
            setOrders(res.data.data);
          })
          .catch((e: unknown) => console.log(e));
      } catch (error) {
        console.error('Error uploading Order:', error);
      }
    };
    if (filterOrder !== '') searchOrder();

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
          .then((res: AxiosResponse<AxiosResponse<Product[]>>) => {
            setProducts(res.data.data);
          })
          .catch((e: unknown) => console.log(e));
      } catch (error) {
        console.error('Error uploading Order:', error);
      }
    };
    if (filterOrder !== '') searchOrder();
    if (inputClient !== '') searchClient();
    if (inputProduct !== '') searchProduct();
  }, [filterOrder, inputClient, inputProduct]);

  // const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  // const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < orders.length;
  // const selectedAll = orders.length > 0 && selected?.size === orders.length;
  const [selectedId, setSelectedId] = useState('');

  const fetchData = () => {
    axios
      .get('/orders', {
        params: {
          page: page + 1,
          size: rowsPerPage,
        },
      } as unknown as Record<string, string>)
      .then((res: AxiosResponse<AxiosResponse<Order[]>>) => {
        setOrders(res.data.data);
        console.log(page);
        console.log(res.data);
        setTotal(res.data.total);
      })
      .catch((e: unknown) => console.log(e));
  };

  const handleDeleteClick = async (productId: string) => {
    try {
      const response = await axios.delete(`/orders/${productId}`);
      // Handle success
      console.log('User deleted successfully:', response.data);
      fetchData();
    } catch (error) {
      // Handle error
      console.error('Error deleting product:', error);
    } finally {
      setIsModalDelete(false);
    }
  };

  const handleDelete = async (productId: string) => {
    setSelectedId(productId);
    setIsModalDelete(true);
    fetchData;
  };

  const handleEditClick = async (row: Order) => {
    console.log(row);
    handleOpen(row.id);
    setInputClient(row.client.name);
    setInputProduct(row.product.name);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOrder(event.target.value);
  };

  const handleInputClientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputClient(event.target.value);
  };

  const handleInputProductChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputProduct(event.target.value);
  };

  const NewUserSchema = Yup.object().shape({
    quantity: Yup.number().typeError('Quantity must be a number').required('Quantity is required'),
    client: Yup.object().shape({
      name: Yup.string().required("Client's name is required"),
    }),
    product: Yup.object().shape({
      name: Yup.string().required("Product's name is required"),
    }),
  });
  interface FormValuesProps extends Order {}
  // Set up form methods with Yup resolver
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    // Provide default values if needed
    defaultValues: selectedOrder,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [open, setOpen] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);

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

  const handleOpen = (id: string) => {
    const prod = orders.find((p) => p.id === id);
    if (prod) setSelectedOrder({ ...prod });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const onUpdate = async (data: Order) => {
    console.log(data);
    const orderData = {
      product_id: data.product.id,
      client_id: data.client.id,
      quantity: data.quantity,
    };
    try {
      const response = await axios.post(`/orders/${data.id}`, orderData, {
        headers: {
          _method: 'put',
          'Content-Type': 'multipart/form-data', // Ensure proper content type for file uploads
        },
      });
      fetchData();
      handleClose();
    } catch (error) {
      // Handle error
      console.error('Error uploading Order:', error);
    } finally {
      reset(selectedOrder);
    }
  };

  useEffect(() => {
    // Update the form's default values whenever selectedProduct changes
    methods.reset(selectedOrder);
  }, [selectedOrder, methods]);

  return (
    <Card>
      <CustomersFilters filterOrder={filterOrder} onFilterChange={handleFilterChange} />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Date creation</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Typography variant="subtitle2">{row.client.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.product.name}</TableCell>
                  <TableCell>{dayjs(row.created_at).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Stack sx={{ flexDirection: 'row' }}>
                      <IconButton onClick={() => handleEditClick(row)}>
                        <Edit sx={{ fontSize: 24, color: 'blue', cursor: 'pointer' }} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row.id)}>
                        <Delete sx={{ fontSize: 24, color: 'red', cursor: 'pointer' }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={total}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

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
                Update Order
              </h2>
              <FormProvider methods={methods} onSubmit={handleSubmit(onUpdate)}>
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
                        {/* <RHFTextField name="product.name" label="Product Name" /> */}
                        {/* <Autocomplete
                          options={clients}
                          getOptionLabel={(option) => option.name}
                          inputValue={inputClient}
                          onInputChange={handleInputClientChange}
                          renderInput={(params) => (
                            <TextField {...params} label="Search Client" variant="outlined" fullWidth />
                          )}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              onSelect(newValue.value);
                            }
                          }}
                        /> */}

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
                              value={inputClient}
                              getOptionLabel={(option) => option}
                              onChange={(event, value) => {
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
                              value={inputProduct}
                              getOptionLabel={(option) => option}
                              onChange={(event, value) => {
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
                      {isSubmitting ? 'Updating...' : 'Update'}
                    </LoadingButton>
                  </div>
                </Grid>
              </FormProvider>
            </Box>
          </Card>
        </Modal>
      ) : null}

      <Dialog
        open={isModalDelete}
        onClose={() => setIsModalDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalDelete(false)}>Cancel</Button>
          <Button onClick={() => handleDeleteClick(selectedId)}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
