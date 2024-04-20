import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

// Perform null check before accessing attributes
// export const fetchCSRFToken = async (): Promise<string | null> => {
//     try {
//       const response = await axios.get('/csrf-token');
//       return response.data.csrf_token;
//     } catch (error) {
//       console.error('Error fetching CSRF token:', error);
//       return null;
//     }
//   };

//   void (async () => {
//     const csrfToken = await fetchCSRFToken();
//     if (csrfToken) {
//       axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
//     } else {
//       console.error('CSRF token not found');
//     }
//   })();

  export default axios;