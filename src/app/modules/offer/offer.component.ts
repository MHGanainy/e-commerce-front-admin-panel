import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

import { AdminTransactionsDAOService } from "src/app/core/http/admin-transaction-dao.service";

@Component({
  selector: "app-offer",
  templateUrl: "./offer.component.html",
  styleUrls: ["./offer.component.scss"],
})
export class OfferComponent implements OnInit {
  offerID = new FormControl("", [Validators.required]);
  loading = false;
  error;
  constructor(private AdminTransactions: AdminTransactionsDAOService) {}

  ngOnInit(): void {}
  submitOfferID() {
    if (this.offerID.valid && this.offerID.touched) {
      this.loading = true;
      this.AdminTransactions.getOfferID(this.offerID.value).subscribe(
        (res) => {
          this.loading = false;
        },
        (err: any) => {
          this.error = err.error;
          this.loading = false;
        }
      );
    }
  }
}
