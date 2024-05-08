import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

import { UserDAOService } from "src/app/core/http/user-dao.service";

@Component({
  selector: "app-otp-finder",
  templateUrl: "./otp-finder.component.html",
  styleUrls: ["./otp-finder.component.scss"],
})
export class OtpFinderComponent implements OnInit {
  phoneNumber = new FormControl("", [Validators.required]);
  otp = "";
  loading = false;
  constructor(private UserDAOService: UserDAOService) {}

  ngOnInit(): void {}
  findOTP() {
    if (this.phoneNumber.valid && this.phoneNumber.touched) {
      this.loading = true;
      this.UserDAOService.getVerificationCode(this.phoneNumber.value).subscribe(
        (res: any) => {
          this.otp = res;
          this.loading = false;
        },
        (err) => {
          this.otp = err.error;
          this.loading = false;
        }
      );
    }
  }
}
