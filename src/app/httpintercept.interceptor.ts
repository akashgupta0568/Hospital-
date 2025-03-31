import { HttpInterceptorFn } from '@angular/common/http';

export const httpinterceptInterceptor: HttpInterceptorFn = (req, next) => {
  // console.log('Intercepted Request:', req);

  // Retrieve token from localStorage
  const authToken = localStorage.getItem('token');

  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer Token ${authToken}` } : {}) // Attach token if available
    }
  });

  return next(modifiedReq);

};
