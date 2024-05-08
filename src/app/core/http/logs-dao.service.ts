import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { RejectionModel } from "src/app/shared/models/Rejection.model";

import { ApiService } from "./api.service";
import { GlobalDAOService } from "./global-dao.service";

@Injectable({
  providedIn: "root",
})
export class LogsDAOService extends GlobalDAOService<any> {
  pageName = "Logs";
  constructor(api: ApiService) {
    super(api);
  }
}
