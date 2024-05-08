import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Subscription } from "rxjs";
import { AuthService } from "src/app/core/auth/auth.service";
import { PermissionGuard } from "src/app/core/guards/permission.guard";
import { PaymentDAOService } from "src/app/core/http/payment-dao.service";
import { UserDataService } from "src/app/core/services/user-data.service";
import { TransactionModel } from "src/app/shared/models/Transaction.model";
import { UserModel } from "src/app/shared/models/User.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  isAccessDenied = false;
  loading = true;
  bankTransferLength = 0;
  bankTransferLengthLoading = true;
  visaTransferLength = 0;
  visaLengthLoading = true;
  subscriptionArray: Subscription[] = [];
  user;
  constructor(
    public router: Router,
    public permissionGuard: PermissionGuard,
    private userDataService: UserDataService,
    private paymentDAO: PaymentDAOService,
    private authService: AuthService
  ) {
    this.user = this.userDataService.userData;
    if (!permissionGuard.checkPerms(["BANK_TRANSFER_TILE", "VISA_TILE", "AUTH_TILE", "REPORTS_TILE", "MONITOR_TILE", "OPERATION"])) {
      this.isAccessDenied = true;
      return;
    }

    this.userDataService.getSaveUserDataObs().subscribe((res: UserModel) => {
      this.loading = false;
    });

    // Bank Transfer Sub
    if (permissionGuard.checkPerms(["BANK_TRANSFER_TILE"])) {
      const paymentSub = this.paymentDAO.getAllBankTrans().subscribe((res: TransactionModel[]) => {
        this.bankTransferLength = res.length;
        this.bankTransferLengthLoading = false;
      });
      this.subscriptionArray.push(paymentSub);
    }

    // Visa Transfer Sub
    if (permissionGuard.checkPerms(["VISA_TILE"])) {
      const visaPaymentSub = this.paymentDAO
        // Page Size = 999,999,999
        .getAllVisaTrans(999999999, 0, "_id", "asc")
        .subscribe((res: any) => {
          const content = res.content as TransactionModel[];
          for (let i = 0; i < content.length; ) {
            if (!content[i].user || !content[i].unit) content.splice(i, 1);
            else i++;
          }
          this.visaTransferLength = content.length;
          this.visaLengthLoading = false;
        });
      this.subscriptionArray.push(visaPaymentSub);
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptionArray.forEach((element) => {
      if (element) element.unsubscribe();
    });
  }
}
