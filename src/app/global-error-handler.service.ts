import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler{

  constructor() { }
  handleError(err:any){
    console.error((err));
    const a=err.status
    console.log(a);
    
   if (a==0)
        alert("Internet issue")
        // break
      else if (a>400 && a<500)
        alert("Error from clinent");
        // break;/
      else if (a>500)
        alert("Contact provider error from server");


          


    }
    
  }
  


