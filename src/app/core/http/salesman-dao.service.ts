import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { data } from "jquery";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SalesmanModel } from "src/app/shared/models/Salesman.model";
import { environment } from "src/environments/environment";

import { ApiService } from "./api.service";
import { GlobalDAOService } from "./global-dao.service";

@Injectable({
  providedIn: "root",
})
export class SalesmanDAOService extends GlobalDAOService<any> {
  // tslint:disable: ban-types
  pageName = "Salesman";

  constructor(api: ApiService, private http: HttpClient) {
    super(api);
  }

  createOne(newData: any): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/createone`, newData);
  }
  deleteOne(Data: any): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/delete`, Data);
  }

  getAll(): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/getall`, {});
  }

  // tslint:disable-next-line: variable-name
  findOne(body: SalesmanModel) {
    return this.api.postRequest<{
      content: SalesmanModel[];
      empty: boolean;
      first: boolean;
      last: boolean;
      number: number;
      numberOfElements: number;
      pageable: {
        sort: { sorted: boolean; unsorted: boolean; empty: boolean };
        offset: number;
        pageSize: number;
        pageNumber: number;
        paged: boolean;
        unpaged: boolean;
      };
      size: number;
      sort: { sorted: boolean; unsorted: boolean; empty: boolean };
      totalElements: number;
      totalPages: number;
    }>(`${this.pageName}/find?pageSize=${1}&pageNumber=${0}&sortedBy=${"email"}&order=${"asc"}`, body);
  }

  // tslint:disable-next-line: no-shadowed-variable
  find(data: SalesmanModel, pageSize: number, pageNumber: number, sortedBy: string, order: string) {
    return this.api.postRequest<{
      content: SalesmanModel[];
      empty: boolean;
      first: boolean;
      last: boolean;
      number: number;
      numberOfElements: number;
      pageable: {
        sort: { sorted: boolean; unsorted: boolean; empty: boolean };
        offset: number;
        pageSize: number;
        pageNumber: number;
        paged: boolean;
        unpaged: boolean;
      };
      size: number;
      sort: { sorted: boolean; unsorted: boolean; empty: boolean };
      totalElements: number;
      totalPages: number;
    }>(`${this.pageName}/find?pageSize=${pageSize}&pageNumber=${pageNumber}&sortedBy=${sortedBy}&order=${order}`, data);
  }

  findAll() {
    // 2147483647 is the max int value in Java, as our backend is Java Spring
    return this.api.postRequest<{
      content: SalesmanModel[];
      empty: boolean;
      first: boolean;
      last: boolean;
      number: number;
      numberOfElements: number;
      pageable: {
        sort: { sorted: boolean; unsorted: boolean; empty: boolean };
        offset: number;
        pageSize: number;
        pageNumber: number;
        paged: boolean;
        unpaged: boolean;
      };
      size: number;
      sort: { sorted: boolean; unsorted: boolean; empty: boolean };
      totalElements: number;
      totalPages: number;
    }>(`${this.pageName}/find?pageSize=${2147483647}&pageNumber=${0}&sortedBy=${"email"}&order=${"asc"}`, {});
  }

  update(editedSalesman) {
    return this.api.postRequest<SalesmanModel>(`${this.pageName}/update`, editedSalesman);
  }

  addProperties(salesmanID: string, properties: { key: string; values: string[] }[]): Observable<Object> {
    // tslint:disable: no-string-literal
    return this.http
      .post<any>(`${environment.salesBackendUrl}/${this.pageName}/addProperties?salesID=${salesmanID}`, properties, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
      })
      .pipe(
        map((res) => {
          if (res["type"] === "F") {
            throw new HttpErrorResponse({
              error: res["msg1"],
              statusText: "F",
              status: 2000,
            });
          }
          return res["data"];
        })
      );
  }
}
