import { Component, OnInit } from "@angular/core";

import { UserDataService } from "src/app/core/services/user-data.service";

@Component({
  selector: "app-authorization-home",
  templateUrl: "./authorization-home.component.html",
  styleUrls: ["./authorization-home.component.scss"],
})
export class AuthorizationHomeComponent implements OnInit {
  user;
  constructor(private userDataService: UserDataService) {
    this.user = this.userDataService.userData;
  }

  ngOnInit() {}
}
