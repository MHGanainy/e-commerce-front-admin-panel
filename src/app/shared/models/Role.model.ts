import { PermissionModel } from "./Permission.model";

export class RoleModel {
  // tslint:disable-next-line: variable-name
  _id: string;

  roleText: string;
  permissions: PermissionModel[];

  constructor() {
    this.permissions = [];
  }
}
