'use client';

import * as React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';
import axios from '@/app/axios-config';
import { yupResolver } from '@hookform/resolvers/yup';
import { Delete, Edit } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
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
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useSelection } from '@/hooks/use-selection';
import FormProvider, { RHFTextField } from '@/components/hook-form';
import { useTable } from '@/components/table';

function noop(): void {
  // do nothing
}

export interface Client {
  id: string;
  name: string;
  phone: string;
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

  const [clients, setClients] = useState<Client[]>([]);
  const [filterClient, setFilterClient] = useState('');
  const rowIds = React.useMemo(() => {
    return clients.map((customer) => customer.id);
  }, [clients]);

  const [total, setTotal] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>({
    id: '',
    name: '',
    phone: '',
    created_at: '',
  });

  // const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  // const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  // const selectedAll = rows.length > 0 && selected?.size === rows.length;

  useEffect(() => {
    const fetchData = () => {
      axios
        .get('/clients', {
          params: {
            page: page + 1,
            size: rowsPerPage,
          },
        } as unknown as Record<string, string>)
        .then((res: AxiosResponse<AxiosResponse<Client[]>>) => {
          setClients(res.data.data);
          console.log(page);
          console.log(res.data);
          setTotal(res.data.total);
        })
        .catch((e: unknown) => console.log(e));
    };
    fetchData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const searchClient = () => {
      try {
        axios
          .get(`/c/search?keyword=${filterClient}&page=1`)
          .then((res: AxiosResponse<AxiosResponse<Client[]>>) => {
            setClients(res.data.data);
          })
          .catch((e: unknown) => console.log(e));
      } catch (error) {
        console.error('Error uploading Client:', error);
      }
    };
    if (filterClient !== '') searchClient();
  }, [filterClient]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < clients.length;
  const selectedAll = clients.length > 0 && selected?.size === clients.length;
  const [selectedId, setSelectedId] = useState('');

  const fetchData = () => {
    axios
      .get('/clients', {
        params: {
          page: page + 1,
          size: rowsPerPage,
        },
      } as unknown as Record<string, string>)
      .then((res: AxiosResponse<AxiosResponse<Client[]>>) => {
        setClients(res.data.data);
        console.log(page);
        console.log(res.data);
        setTotal(res.data.total);
      })
      .catch((e: unknown) => console.log(e));
  };

  const handleDeleteClick = async (productId: string) => {
    try {
      const response = await axios.delete(`/clients/${productId}`);
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

  const handleEditClick = async (productId: string) => {
    handleOpen(productId);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterClient(event.target.value);
  };

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Name is required'),
  });
  interface FormValuesProps extends Client {}
  // Set up form methods with Yup resolver
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    // Provide default values if needed
    defaultValues: selectedClient,
  });

  const {
    reset,
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
    const prod = clients.find((p) => p.id === id);
    if (prod) setSelectedClient({ ...prod });
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

  const onUpdate = async (data: Client) => {
    console.log('hi');

    try {
      const response = await axios.post(`/clients/${data.id}`, data, {
        headers: {
          _method: 'put',
          'Content-Type': 'multipart/form-data', // Ensure proper content type for file uploads
        },
      });

      fetchData();
      handleClose();
    } catch (error) {
      // Handle error
      console.error('Error uploading client:', error);
    } finally {
      reset(selectedClient);
    }
  };

  useEffect(() => {
    // Update the form's default values whenever selectedProduct changes
    methods.reset(selectedClient);
  }, [selectedClient, methods]);

  return (
    <Card>
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
              <TableCell>Nom</TableCell>
              <TableCell>Telephone</TableCell>
              <TableCell>Date creation</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((row) => {
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
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{dayjs(row.created_at).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Stack sx={{ flexDirection: 'row' }}>
                      <IconButton onClick={() => handleEditClick(row.id)}>
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
                Modifier Produit
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
                        <RHFTextField name="name" label="Nom" />
                      </Stack>
                      <Stack spacing={1}>
                        <RHFTextField name="phone" label="Telephone" />
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
        <DialogTitle id="alert-dialog-title">Confirmation de la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Etes vous sur que vous voulez supprimer?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalDelete(false)}>Non</Button>
          <Button onClick={() => handleDeleteClick(selectedId)}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
