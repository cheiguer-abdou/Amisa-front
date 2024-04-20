import axios from 'axios';
// config
import { HOST_API_KEY } from '../config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API_KEY });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);


export default axiosInstance;
export const TOKEN =
  'YATA eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMTExMzMzMzExIiwiZXhwIjoxNzEwNzYyMTc5LCJyb2xlcyI6WyJNRURFQ0lOIiwiVVNFUiJdLCJpZCI6Mywic2Vzc2lvbiI6MTE1NjQzLCJmaXJlYmFzZV9hdXRoX3Rva2VuIjoiZXlKaGJHY2lPaUpTVXpJMU5pSjkuZXlKaGRXUWlPaUpvZEhSd2N6b3ZMMmxrWlc1MGFYUjVkRzl2Ykd0cGRDNW5iMjluYkdWaGNHbHpMbU52YlM5bmIyOW5iR1V1YVdSbGJuUnBkSGt1YVdSbGJuUnBkSGwwYjI5c2EybDBMbll4TGtsa1pXNTBhWFI1Vkc5dmJHdHBkQ0lzSW1WNGNDSTZNVFkzT1RZMk1UYzNPU3dpYVdGMElqb3hOamM1TmpVNE1UYzVMQ0pwYzNNaU9pSm1hWEpsWW1GelpTMWhaRzFwYm5Oa2F5MXRNbU4xWjBCNVlYUmhiV1ZrYVdOaGJDMDJPVFk0T0M1cFlXMHVaM05sY25acFkyVmhZMk52ZFc1MExtTnZiU0lzSW5OMVlpSTZJbVpwY21WaVlYTmxMV0ZrYldsdWMyUnJMVzB5WTNWblFIbGhkR0Z0WldScFkyRnNMVFk1TmpnNExtbGhiUzVuYzJWeWRtbGpaV0ZqWTI5MWJuUXVZMjl0SWl3aWRXbGtJam9pTlNKOS5SRy0wTldXV3htcElaM1h6RDVZMGtHZnpvbWdWM2gzczdfX3JwSC1EZDQzcTJ0WjM2Qk1DYjBPQW9XM0l6NWJPdFh6emJ1NWpXMlk2d2d2Rmdzc1FuNHZaOGZaR0ppcjVJbUVzbzJPdmRYVGpTT011cUtNMFZ1cHNxS1Axd0Q5M093S2FFMFdSSkY1eVBzY2MwWG0xS0ZkdGV2b0VXeUp2T2NoWkJONkdIaEVIUndJOTFDYUhsMEIyRk14TWthM0NNV1h5SWRvU3RlbndEQmVOampjcDVCRXl3U2d3X3M0YWdSTjBhMm1Pa3p4Ujk1bUtOREY1MWRYWkwwcjh6dUhWV1o1bjhMNFA3YlpWS2Zvc1VzVGJLZWlUSVd5dEExOXF0X1FsZjNlSUd1bVpJbHMtN3MxM3VmVmNtcE9JYVIteHF6bWc1cTdoOHNqUVdWSjBqaElQc2cifQ.VlOOsVqaw39YSuTa2rCX24ITMbZEpcK5quRymTtcbbw';

// localStorage.getItem('accessToken');

export const Request = axios.create({
  baseURL: "HOST_API_KEY",
  headers: {
    // 'Content-Type': 'application/json',
    Authorization: `${TOKEN}`,
  },
});
