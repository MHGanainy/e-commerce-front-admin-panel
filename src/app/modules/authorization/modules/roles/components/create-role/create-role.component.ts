import { Component, OnInit } from "@angular/core";

import { MatDialogRef } from "@angular/material/dialog";
import { RoleModel } from "src/app/shared/models/Role.model";
import { ValidationFunctions } from "src/app/shared/functions/validation.functions";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "authorization-create-role",
  templateUrl: "./create-role.component.html",
  styleUrls: ["./create-role.component.scss"],
})
export class CreateRoleComponent implements OnInit {
  errorMsg: string;

  newRole = new RoleModel();

  constructor(private dialogRef: MatDialogRef<CreateRoleComponent>) {}

  ngOnInit(): void {}

  save() {
    // Init error message
    this.errorMsg = null;

    // Checking fields are not empty
    if (this.newRole._id && this.newRole.roleText) this.dialogRef.close(this.newRole);
    else {
      this.errorMsg = "Please fill in all required inputs";

      // Checking _id field
      const idElement = document.getElementById("role-input-_id");
      if (!this.newRole._id) idElement.classList.add("is-invalid");
      else idElement.classList.remove("is-invalid");

      // Checking roleText field
      const roleTextElement = document.getElementById("role-input-roleText");
      if (!this.newRole._id) roleTextElement.classList.add("is-invalid");
      else roleTextElement.classList.remove("is-invalid");
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
