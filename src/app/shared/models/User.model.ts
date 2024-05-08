import { UserRoleModel } from "./UserRole.model";

export class UserModel {
  // tslint:disable-next-line: variable-name
  _id: string = null;
  email: string = null;
  username: string = null;
  mobile: string = null;
  password: string = null;
  // confirmPassword: string = null;
  firstName: string = null;
  lastName: string = null;

  roles: UserRoleModel[];

  constructor() {}
}
