import * as React from 'react';

import type { UserContextValue } from '@/contexts/user-context';
import { UserContext } from '@/contexts/user-context';
import { useEffect, useState } from 'react';
import axios from '@/app/axios-config';
import { AxiosResponse } from 'axios';
import { User } from '@/components/dashboard/user/customers-table';
import { redirect } from 'next/dist/server/api-utils';

export function useUser(): UserContextValue {
  // const context = React.useContext(UserContext);

  // if (!context) {
  //   throw new Error('useUser must be used within a UserProvider');
  // }

  // return context;

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        const response: AxiosResponse<User> =  await axios.get('/check-session', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          },
        });
        console.log(response.data)
        setUser(response.data.user);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        if(error.response.status === 401)  {
          localStorage.removeItem('accessToken')
          window.location.href = "/auth/sign-in"
         }
        
        setIsLoading(false);
      }
    };

    void checkSession();

    // Clean up function
    return () => {
      // Cleanup logic if needed
    };
  }, []);

  return { user, error, isLoading };

}
