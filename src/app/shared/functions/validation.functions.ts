import { Injectable } from "@angular/core";

@Injectable()
export class ValidationFunctions {
  validate(search, obj, Comp) {
    let isValid = true;
    Object.keys(obj).forEach((key) => {
      const X = Comp + key;

      if (search.includes(X)) {
        const element = document.getElementById(X);
        // tslint:disable-next-line: triple-equals
        if (obj[key] == "" || obj[key] == null) {
          element.classList.add("is-invalid");
          isValid = false;
        } else {
          element.classList.remove("is-invalid");
        }
      }
    });
    return isValid;
  }

  checkPasswordMatch(
    // tslint:disable: ban-types
    password: string | String,
    repassword: string | String,
    passwordElementID: string | String,
    repasswordElementID?: string | String
  ) {
    const passwordElement = document.getElementById(String(passwordElementID));
    let repasswordElement: HTMLElement;
    if (repasswordElementID) repasswordElement = document.getElementById(String(repasswordElementID));

    if (String(password) !== String(repassword)) {
      passwordElement.classList.add("is-invalid");
      if (repasswordElement) repasswordElement.classList.add("is-invalid");

      return false;
    }

    passwordElement.classList.remove("is-invalid");
    if (repasswordElement) repasswordElement.classList.remove("is-invalid");

    return true;
  }
}
