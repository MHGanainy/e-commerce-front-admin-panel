import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url

        // let currentToken = document.cookie;
        // console.log(currentToken, "dsklfjdlfjsd");
        // currentToken = currentToken.split('=')[1];

        // if (currentToken) {
        request = request.clone({
            withCredentials: true,
        });
        // }

        return next.handle(request);
    }
}