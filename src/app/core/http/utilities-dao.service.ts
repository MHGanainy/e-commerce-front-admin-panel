import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { CompanyCodeObj } from "src/app/shared/models/CompanyCode.model";
import { PermissionModel } from "src/app/shared/models/Permission.model";

import { ApiService } from "./api.service";
import { GlobalDAOService } from "./global-dao.service";

@Injectable({
  providedIn: "root",
})
export class UtilitiesDAOService extends GlobalDAOService<any> {
  // tslint:disable: ban-types
  pageName = "Utilities";

  constructor(api: ApiService) {
    super(api);
  }

  getAllPermissions(): Observable<PermissionModel[]> {
    return new Observable<PermissionModel[]>((observer) => {
      this.api
        .postRequest<{ _id: string; values: { key: string; desc: string }[] }>(`${this.pageName}/getUtilList?utilID=Permissions`, {})
        .subscribe((res) => {
          // Extracting permissions from response
          const perms = res.values.map((val) => {
            const perm = new PermissionModel();
            perm.permission = val.key;
            perm.permissionText = val.desc;
            return perm;
          });

          // Sorting permissions
          const sortedPerms = perms.sort((a, b) => {
            if (a.permissionText.toLowerCase() > b.permissionText.toLowerCase()) return 1;
            else if (a.permissionText.toLowerCase() < b.permissionText.toLowerCase()) return -1;
            else return 0;
          });

          observer.next(sortedPerms);
          observer.complete();
        });
    });
  }

  getAllCompanyCode(): Observable<CompanyCodeObj[]> {
    return new Observable<CompanyCodeObj[]>((observer) => {
      this.api
        .postRequest<{ _id: string; values: { key: string; desc: string }[] }>(`${this.pageName}/getUtilList?utilID=CompanyCode`, {})
        .subscribe((res) => {
          // Extracting company codes from response
          const compCodes = res.values.map((val) => {
            const compCode = new CompanyCodeObj();
            compCode.compCode = val.key;
            compCode.compCodeText = val.desc;
            return compCode;
          });

          // Sorting company codes
          const sortedCompCodes = compCodes.sort((a, b) => {
            if (a.compCode.toLowerCase() > b.compCode.toLowerCase()) return 1;
            else if (a.compCode.toLowerCase() < b.compCode.toLowerCase()) return -1;
            else return 0;
          });

          observer.next(sortedCompCodes);
          observer.complete();
        });
    });
  }
}
