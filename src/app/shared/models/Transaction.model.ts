import { AttachedFileModel } from "./AttachedFile.model";
import { ClientUserModel } from "./ClientUser.model";
import { UnitModel } from "./Unit.model";

export class TransactionModel {
  _id: String;
  unit: UnitModel;
  totalAmount: String;
  amount: String;
  paymentPlan: String;
  paymentPlan_desc: String;
  paymentPlan_desc_ar: String;
  finishStatus: String;
  paymentType: String; // partial or complete
  paymentMethod: String; // bank or visa
  transferImage: String;
  visaresponseCode: String;
  visaResponseText: String;
  offerID: String;
  transactionDateTime: string;
  offerStatus: String;
  status: String;
  bankName: String;
  currency: String;
  transferCurrency: String;
  transferDate: String;
  transactionDate: String;
  transactionTime: String;
  transactionCode: String;
  transaction_id: String;
  tmgBank: String;
  tmgAccount: String;
  transferSlip: AttachedFileModel;
  user: ClientUserModel;
  printApprovalStatus: String;
  rejectionReason: String;
  reservationAmont: String;
  expectedAmount: String;
  bankStatus: String;
  bankRejectionReason: String;
}
