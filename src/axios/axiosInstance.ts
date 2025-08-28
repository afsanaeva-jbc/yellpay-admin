
const mockAxiosInstance = {
  get: async (url: string) => {
    console.log(`Mock GET request to: ${url}`);
    return Promise.resolve({ data: { message: 'Using dummy data' } });
  },
  post: async (url: string, data: any) => {
    console.log(`Mock POST request to: ${url}`, data);
    return Promise.resolve({ data: { message: 'Using dummy data' } });
  },
  put: async (url: string, data: any) => {
    console.log(`Mock PUT request to: ${url}`, data);
    return Promise.resolve({ data: { message: 'Using dummy data' } });
  },
  delete: async (url: string) => {
    console.log(`Mock DELETE request to: ${url}`);
    return Promise.resolve({ data: { message: 'Using dummy data' } });
  },
};

export default mockAxiosInstance;