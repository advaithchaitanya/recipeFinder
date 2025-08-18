import { HttpInterceptorFn } from '@angular/common/http';

export const interceptorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("InterSeptor call");
  console.log(req)
  
  return next(req);
};
