import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /*
    Authenticate Request
    -------------------------------------

    method 01 - Now If we need to inject the the auth service into the post service. We can inject the auth service in this constructor. then call get token on the object object and the simply add a headers to all our outgoing http request here.

    method 02 - (this method is preferable for Angular)
    * Interceptor - Interceptor for my Http client. That is a feature offered by the angular http client. We can add interceptors which are simply functions that will run on any outgoing http request and we can then manipulate these outgoing request for example to attach our token.That is actually what i want to do. It Works Like middleware*/

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    // req - outgoing request
    // next - middleware

    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    //console.log('28 auth-interceptor',authRequest);
    return next.handle(authRequest);
  }

}
