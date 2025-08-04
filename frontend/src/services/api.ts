import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // Include cookies in requests
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.log('Unauthorized access - token may be expired');
    }
    
    return Promise.reject(error);
  }
);

export default api;

// // src/services/api.ts (临时修改用于测试)
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api/v1',
//   withCredentials: true,
// });

// // 临时拦截器 - 仅用于测试 fulfilled 状态
// api.interceptors.request.use((config) => {
//   // 检查是否是登录请求且使用测试凭据
//   if (config.url === '/users/login' && config.data) {
//     const { email, password } = config.data;
    
//     // 模拟成功登录的测试凭据
//     if (email === 'admin@tours.io' && password === 'test1234') {
//       console.log('🎭 拦截登录请求，返回模拟成功响应');
      
//       // 返回一个 Promise，模拟成功响应
//       return Promise.reject({
//         response: {
//           status: 200,
//           data: {
//             status: 'success',
//             data: {
//               doc: {
//                 id: 'test-user-123',
//                 name: 'Test User',
//                 email: 'test@example.com',
//                 photo: 'https://via.placeholder.com/150',
//                 roles: 'user'
//               }
//             }
//           }
//         },
//         __mock_success: true // 特殊标记
//       });
//     }
//   }
  
//   return config;
// });

// // 修改响应拦截器处理模拟成功
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // 如果是我们的模拟成功响应
//     if (error.__mock_success) {
//       console.log('🎭 处理模拟成功响应');
//       return Promise.resolve(error.response);
//     }
    
//     console.error('API Error:', error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// export default api;
