export class CompanyCodeObj {
  compCode: string;
  compCodeText: string;

  constructor(compCode?: string, compCodeText?: string) {
    if (compCode) this.compCode = compCode;
    if (compCodeText) this.compCodeText = compCodeText;
  }
}
