import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

import { ErrorDialogService } from "../services/error-dialog.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  errorTemplate: ServerErrorResponse;

  unknownErrorMessage = "Unknown Error";
  unauthorizedMessage = "You are not Authorized";
  forbiddenMessage = "You are not Verified";
  notFoundMessage = "Object not found";
  internalErrorMessage = "Internal Server Error";
  jwtTokenExpireMessage = "Session has expired";

  constructor(public errorDialogService: ErrorDialogService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(this.handleError.bind(this)));
  }

  handleError(err: HttpErrorResponse): Observable<HttpEvent<HttpErrorResponse>> {
    if (err.error) {
      if (!err.error.status) {
        let errorTemplate: Partial<ServerErrorResponse> = {
          status: err.status,
          message: this.unknownErrorMessage,
          error: err.name,
        };
        if (!environment.production) {
          this.errorDialogService.openDialog(errorTemplate);
        } else {
          console.error(errorTemplate);
        }
      } else {
        let serverError: {
          error: ServerErrorResponse;
          dialog: boolean;
        } = this.standardErrors(err.error);
        if (serverError.dialog) {
          if (err.status === 401 || err.status === 504 || err.status === 403) {
          } else {
            if (!environment.production) {
              this.errorDialogService.openDialog(serverError.error);
            } else {
              console.error(serverError.error);
            }
          }
        }
      }
    } else {
      let customError: Object = Object.assign({}, err);
      customError["message"] = null;
      let serverError: {
        error: ServerErrorResponse;
        dialog: boolean;
      } = this.standardErrors(customError);
      if (serverError.dialog) {
        if (customError["status"] === 401 || customError["status"] === 504 || customError["status"] === 403) {
        } else {
          if (!environment.production) {
            this.errorDialogService.openDialog(serverError.error);
          } else {
            console.error(serverError.error);
          }
        }
      }
    }
    return throwError(err);
  }

  standardErrors(error: any): { error: any; dialog: boolean } {
    let dialog: boolean = true;
    if (error.status === 401) error.message = error.message ? error.message : this.unauthorizedMessage;
    else if (error.status === 403) error.message = error.message ? error.message : this.forbiddenMessage;
    else if (error.status === 404) error.message = error.message ? error.message : this.notFoundMessage;
    else if (error.status === 500) error.message = error.message ? error.message : this.internalErrorMessage;
    else if (error.status === 504) error.message = error.message ? error.message : this.jwtTokenExpireMessage;
    else {
      dialog = false;
    }
    return { error, dialog };
  }
}
