import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "src/app/core/auth/auth.service";
import { PermissionGuard } from "src/app/core/guards/permission.guard";
import { UserDataService } from "src/app/core/services/user-data.service";
import { UserModel } from "src/app/shared/models/User.model";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  loading = true;
  name: string;
  user;
  constructor(
    public router: Router,
    public permissionGuard: PermissionGuard,
    private authService: AuthService,
    private userDataService: UserDataService
  ) {
    this.userDataService.getSaveUserDataObs().subscribe((res: UserModel) => {
      this.loading = false;
      if (res) this.name = res.firstName;
    });
    this.user = this.userDataService.userData;
  }

  ngOnInit() {
    this.getName();
  }

  logOut() {
    this.authService.logOut();
  }

  getName() {
    const user = this.userDataService.userData;
    if (user) this.name = user.firstName;
    else this.name = null;
  }
}
