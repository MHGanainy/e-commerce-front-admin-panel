import { AttachedFileModel } from "./AttachedFile.model";

export class ClientUserModel {
  _id: String = null;
  email: String = null;
  mobile: String = null;
  countryCode: String = null;
  landLine: String = null;
  password: String = null;
  confirmPassword: String = null;
  verified: Boolean = null;
  firstName: String = null;
  lastName: String = null;
  gender: String = null;
  identificationType: String = null;
  nationalID: String = null;
  nationality: String = null;
  birthDate: String = null;
  address: String = null;
  region: String = null;
  city: String = null;
  cityDesc: String = null;
  country: String = null;
  countryDesc: String = null;
  area: String = null;
  relationship: String = null;
  sapPartnerID: String = null;
  qualification: String = null; //educational qualification
  attachedFileList: AttachedFileModel;
  fullyRegistered: Boolean = null;
  state: string = null;
  postalCode: string = null;
  utmCampaign: string = null;
  utmContent: string = null;
  utmMedium: string = null;
  utmSource: string = null;
  utmTerm: string = null;
  copyUser(user: ClientUserModel) {
    for (let element in user) {
      this[element] = user[element];
    }
  }
}
