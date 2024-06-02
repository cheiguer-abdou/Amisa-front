'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/system';
import { AxiosResponse } from 'axios';
import { Label } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useUser } from '@/hooks/use-user';
import { RHFTextField } from '@/components/hook-form';
import FormProvider from '@/components/hook-form/FormProvider';

import axios from '../../../app/axios-config';
import { type User } from '../user/customers-table';

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;

export function AccountDetailsForm(): React.JSX.Element {
  const { user } = useUser();
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email address is required'),
    phone: Yup.string().required('Phone Number is required'),
  });
  const defaultValues = user ? user : { name: '', email: '', phone: '' };
  const methods = useForm<User>({
    resolver: yupResolver(NewUserSchema),
    // Provide default values if needed
    defaultValues: user || undefined,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: User) => {
    try {
      console.log(data);

      const formData = new FormData();

      // if (selectedFile) formData.append('image', selectedFile);
      Object.entries(data).forEach(([key, value]: [string, string | Blob]) => {
        formData.append(key, value);
      });

      const response: AxiosResponse<User> = await axios.post(`/employees/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure proper content type for file uploads
        },
      });

      console.log(response);
    } catch (error) {
      // Handle error
      console.error('Error uploading product:', error);
    }
  };

  // Reset the form whenever default values change
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  if (user === null) {
    return <></>;
  }
  return (
    // <form
    //   onSubmit={(event, data: unknown) => {
    //     console.log(data);
    //     event.preventDefault();
    //     // const response = axios.post("/employees", data)
    //     // console.log(response)
    //   }}
    // >
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <Stack spacing={1}>
                <RHFTextField name="name" label="Name" defaultValue={defaultValues.name || ''} />
              </Stack>
            </Grid>
            <Grid md={6} xs={12}>
              <Stack spacing={1}>
                <RHFTextField
                  name="email"
                  label="Email Address"
                  defaultValue={defaultValues.email || ''}
                  type="email"
                />
              </Stack>
            </Grid>
            <Grid md={6} xs={12}>
              <Stack spacing={1}>
                <RHFTextField name="phone" label="Phone" defaultValue={defaultValues.phone || ''} type="tel" />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Save details
          </Button>
        </CardActions>
      </Card>
    </FormProvider>
  );
}
