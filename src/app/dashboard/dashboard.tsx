'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Modal, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { type AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { type Client } from '@/components/dashboard/client/customers-table';
import { type Order } from '@/components/dashboard/order/customers-table';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts, type Product } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
// import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { Produit } from '@/components/dashboard/produit/customers-table';
import FormProvider, { RHFTextField } from '@/components/hook-form';

import axios from '../axios-config';

export interface Budget {
  budget: string;
  profit: string;
}

export interface Sales {
  product_id: string;
  year: number;
  month: string;
  total_revenue: string;
}

interface SalesAndProfits {
  profit: string;
  sales: string;
}

interface FormValuesProps extends Omit<Budget, 'avatar' | 'createdAt'> {}

export default function Dashboard(): React.JSX.Element {
  const [budget, setBudget] = useState<Budget>({
    budget: '',
    profit: '',
  });

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

  const NewUserSchema = Yup.object().shape({
    budget: Yup.number()
      .typeError('Budget doit être un nombre')
      .required('Budget doit etre superieur ou egal a 0')
      .min(0, 'Budget doit etre superieur ou egal a 0'),
    profit: Yup.number()
      .typeError('Profit doit être un nombre')
      .required('Profit doit etre superieur ou egal a 0')
      .min(0, 'Profit doit etre superieur ou egal a 0'),
  });
  // const [defaultValues] = {
  //   budget: budget.budget,
  //   profit: budget.profit,
  // };

  // Set up form methods with Yup resolver
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    // Provide default values if needed
    defaultValues: budget,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [clientsCount, setClientsCount] = useState(0);
  const [salesAndProfit, setSalesAndProfit] = useState<SalesAndProfits>({
    profit: '',
    sales: '',
  });
  const [sales, setSales] = useState<Sales[]>([]);
  const [currentYearSales, setCurrentYearSales] = useState<number[]>([]);
  const [lastYearSales, setLastYearSales] = useState<number[]>([]);
  const [products, setProducts] = useState<Produit[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchData = () => {
    axios
      .get('http://127.0.0.1:8000/api/budgets')
      .then((res: AxiosResponse<Budget>) => {
        setBudget(res.data);
      })
      .catch((e: unknown) => console.log(e));

    axios
      .get('http://127.0.0.1:8000/api/c/count')
      .then((res: AxiosResponse<string>) => {
        const count = parseInt(res.data, 10);
        setClientsCount(count);
        console.log(res.data);
      })
      .catch((e: unknown) => console.log(e));

    axios
      .get('http://127.0.0.1:8000/api/products/price')
      .then((res: AxiosResponse<SalesAndProfits>) => {
        setSalesAndProfit(res.data);
      })
      .catch((e: unknown) => console.log(e));
    axios
      .get('http://127.0.0.1:8000/api/orders/sales')
      .then((res: AxiosResponse<Sales[]>) => {
        // console.log(res.data);
        setSales(res.data);
        organizeSalesData(res.data);
      })
      .catch((e: unknown) => console.log(e));

    axios
      .get('http://127.0.0.1:8000/api/products')
      .then((res: AxiosResponse<AxiosResponse<Produit[]>>) => {
        // console.log(res.data);
        setProducts(res.data.data);
      })
      .catch((e: unknown) => console.log(e));
    axios
      .get('http://127.0.0.1:8000/api/orders')
      .then((res: AxiosResponse<AxiosResponse<Order[]>>) => {
        // console.log(res.data);
        setOrders(res.data.data);
      })
      .catch((e: unknown) => console.log(e));
  };

  const organizeSalesData = (salesData: Sales[]) => {
    const current = Array<number>(12).fill(0);
    const last = Array<number>(12).fill(0);

    salesData.forEach((sale) => {
      const monthIndex = parseInt(sale.month) - 1; // Adjust month to zero-based index
      const totalRevenue = parseInt(sale.total_revenue);
      console.log(sale.month, sale.year);

      if (sale.year === 2024) {
        current[monthIndex] += totalRevenue;
      } else {
        last[monthIndex] += totalRevenue;
      }
    });

    console.log(current);

    setCurrentYearSales(current);
    setLastYearSales(last);
  };

  const calculatePercentage = (value: string, total: string): number => {
    const v = parseInt(value);
    const t = parseInt(total);
    return parseInt(((v / t) * 100).toFixed(2));
  };

  const formatNumber = (number: string) => {
    const n = parseInt(number);
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(1)}m`;
    } else if (n >= 1000) {
      return `${(n / 1000).toFixed(1)}k`;
    }
    return n.toString();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    reset(budget);
    setOpen(true);
    console.log(budget);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const formData = new FormData();

      // if (selectedFile) formData.append('image', selectedFile);
      // Object.entries(data).forEach(([key, value]) => {
      //   if (typeof value === 'string' || value instanceof Blob) {
      //     formData.append(key, value);
      //   } else {
      //     console.error(`Invalid type for ${key}`);
      //   }
      // });

      const response: AxiosResponse<Budget> = await axios.post('/update-budget', data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure proper content type for file uploads
        },
      });

      // Handle successful upload
      const newBudget: Budget = response.data.data; // Assuming the response contains the newly created product
      setBudget(newBudget);
      console.log(response.data.data);
      handleClose();
    } catch (error) {
      // Handle error
      console.error('Error uploading product:', error);
    } finally {
      // reset(budget);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12} onClick={handleOpen}>
        <Budget sx={{ height: '100%' }} value={formatNumber(budget.budget)} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers sx={{ height: '100%' }} value={clientsCount} />
      </Grid>
      {/* <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid> */}
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value={formatNumber(budget.profit)} />
      </Grid>
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: currentYearSales },
            { name: 'Last year', data: lastYearSales },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic
          chartSeries={[
            100 - calculatePercentage(salesAndProfit.profit, salesAndProfit.sales),
            calculatePercentage(salesAndProfit.profit, salesAndProfit.sales),
          ]}
          labels={['Sales', 'Profit']}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <LatestProducts products={products} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders orders={orders} sx={{ height: '100%' }} />
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card>
          <Box sx={style}>
            <h2 id="modal-modal-title" style={{ textAlign: 'center' }}>
              Modifier budget
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
                      <RHFTextField name="budget" label="Budget" />
                    </Stack>
                    <Stack spacing={1}>
                      <RHFTextField name="profit" label="Profit" />
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
                    Modifier
                  </LoadingButton>
                </div>
              </Grid>
            </FormProvider>
          </Box>
        </Card>
      </Modal>
    </Grid>
  );
}
