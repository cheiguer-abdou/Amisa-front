'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { type AxiosResponse } from 'axios';

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

export default function Dashboard(): React.JSX.Element {
  const [budget, setBudget] = useState<Budget>({
    budget: '',
    profit: '',
  });

  const [clientsCount, setClientsCount] = useState(0);
  const [salesAndProfit, setSalesAndProfit] = useState<SalesAndProfits>({
    profit: '',
    sales: '',
  });
  const [sales, setSales] = useState<Sales[]>([]);
  const [currentYearSales, setCurrentYearSales] = useState<number[]>([]);
  const [lastYearSales, setLastYearSales] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
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
        setClientsCount(res.data);
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
      .then((res: AxiosResponse<AxiosResponse<Product[]>>) => {
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const current: number[] = Array(12).fill(0);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const last: number[] = Array(12).fill(0);

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
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
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
    </Grid>
  );
}
