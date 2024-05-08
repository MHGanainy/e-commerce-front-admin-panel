import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onNavigate(data: any) {
    if (data == "Daily Qualified & Committed Opportunities (C4C)") {
      window.open(
        "https://my347652.crm.ondemand.com/sap/ap/ui/clogin?saml2=disabled&app.component=%2fSAP_UI_CT%2fMain%2froot.uiccwoc&rootWindow=X&redirectUrl=%2fsap%2fpublic%2fbyd%2fruntime#Nav/1/eyJzb3VyY2UiOiI2JC9TQVBfQllEX1RGL0FuYWx5dGljcy9LZXlVc2VyQW5hbHl0aWNzL0FOQV9LVUFfUmVwb3J0RmFjZVdpemFyZF9HQUYuR0FGLnVpY29tcG9uZW50IiwidGFyZ2V0IjoiL1NBUF9CWURfVEYvQW5hbHl0aWNzL0FuYWx5c2lzUGF0dGVybi9BTkFfQVBfU3RhbmRhbG9uZS5RQS51aWNvbXBvbmVudCIsImluUG9ydCI6IkFuYWx5c2lzUGF0dGVybiIsImxpc3RzIjp7fSwicGFyYW1zIjp7IlJlcG9ydElkIjp7InZhbHVlIjoiWjgxREY3MDVDOTAzNDdENDJCNERENTQifSwiS1VBTW9kZSI6eyJjb25zdGFudCI6IlgifX0sIndpbklkIjoiNjYyYjg5MzAyNGY2NWUzNGNjMzZkOGUzNDVhYmUzMzgifQ==",
        "_blank"
      );
    }
    if (data == "Employee Forecast (C4C)") {
      window.open(
        "https://my347652.crm.ondemand.com/sap/ap/ui/clogin?saml2=disabled&app.component=%2fSAP_UI_CT%2fMain%2froot.uiccwoc&rootWindow=X&redirectUrl=%2fsap%2fpublic%2fbyd%2fruntime#Nav/1/eyJzb3VyY2UiOiI0JC9TQVBfQllEX1RGL0FuYWx5dGljcy9LZXlVc2VyQW5hbHl0aWNzL2FuYV9yZXBvcnRfbGlzdF9rdWEuT1dMLnVpY29tcG9uZW50IiwidGFyZ2V0IjoiL1NBUF9CWURfVEYvQW5hbHl0aWNzL0FuYWx5c2lzUGF0dGVybi9BTkFfQVBfU3RhbmRhbG9uZS5RQS51aWNvbXBvbmVudCIsImluUG9ydCI6IkFuYWx5c2lzUGF0dGVybiIsImxpc3RzIjp7fSwicGFyYW1zIjp7IlJlcG9ydElkIjp7InZhbHVlIjoiWjJCREEwMkYxQTA0NjM2QTRDMEM3RUEifSwiS1VBTW9kZSI6eyJjb25zdGFudCI6IlgifSwiU2NlbmFyaW8iOnsidmFsdWUiOiJBUCJ9LCJSZXBvcnRUeXBlIjp7InZhbHVlIjoiMDEifX0sIndpbklkIjoiMmEwNzcwNjhjZjNlM2E1YjViNWE4NTZhODI3ZDQyMDIifQ==",
        "_blank"
      );
    }
    if (data == "Daily Appointments (C4C)") {
      window.open(
        "https://my347652.crm.ondemand.com/sap/ap/ui/clogin?saml2=disabled&app.component=%2fSAP_UI_CT%2fMain%2froot.uiccwoc&rootWindow=X&redirectUrl=%2fsap%2fpublic%2fbyd%2fruntime#Nav/1/eyJzb3VyY2UiOiIyMSQvU0FQX0JZRF9URi9BbmFseXRpY3MvS2V5VXNlckFuYWx5dGljcy9hbmFfcmVwb3J0X2xpc3Rfa3VhLk9XTC51aWNvbXBvbmVudCIsInRhcmdldCI6Ii9TQVBfQllEX1RGL0FuYWx5dGljcy9BbmFseXNpc1BhdHRlcm4vQU5BX0FQX1N0YW5kYWxvbmUuUUEudWljb21wb25lbnQiLCJpblBvcnQiOiJBbmFseXNpc1BhdHRlcm4iLCJsaXN0cyI6e30sInBhcmFtcyI6eyJSZXBvcnRJZCI6eyJ2YWx1ZSI6IlpCNTZFQjMwQkYyOEFDMjM2RjA3NURBIn0sIktVQU1vZGUiOnsiY29uc3RhbnQiOiJYIn0sIlNjZW5hcmlvIjp7InZhbHVlIjoiQVAifSwiUmVwb3J0VHlwZSI6eyJ2YWx1ZSI6IjAxIn19LCJ3aW5JZCI6ImFlY2NjZTliMjg0NzcyM2QxYjcwOTNhOTU4MmVhNmNlIn0=",
        "_blank"
      );
    }
    if (data == "Daily Sales (C4C)") {
      window.open(
        "https://my347652.crm.ondemand.com/sap/ap/ui/clogin?saml2=disabled&app.component=%2fSAP_UI_CT%2fMain%2froot.uiccwoc&rootWindow=X&redirectUrl=%2fsap%2fpublic%2fbyd%2fruntime#Nav/1/eyJzb3VyY2UiOiIyNyQvU0FQX0JZRF9URi9BbmFseXRpY3MvS2V5VXNlckFuYWx5dGljcy9BTkFfS1VBX1JlcG9ydEZhY2VXaXphcmRfR0FGLkdBRi51aWNvbXBvbmVudCIsInRhcmdldCI6Ii9TQVBfQllEX1RGL0FuYWx5dGljcy9BbmFseXNpc1BhdHRlcm4vQU5BX0FQX1N0YW5kYWxvbmUuUUEudWljb21wb25lbnQiLCJpblBvcnQiOiJBbmFseXNpc1BhdHRlcm4iLCJsaXN0cyI6e30sInBhcmFtcyI6eyJSZXBvcnRJZCI6eyJ2YWx1ZSI6Ilo0MjQ4Qzc1QkE3RTA3NDkwMUNBMUY4In0sIktVQU1vZGUiOnsiY29uc3RhbnQiOiJYIn19LCJ3aW5JZCI6IjAyZmRhZDk0YzFjOWU4MzkyN2U1NDcwY2Q1YjYwMGEyIn0=",
        "_blank"
      );
    }
    if (data == "VSO Salesman Stats") {
      window.open(
        "https://sapprd.tmg.com.eg:44300/fiori/shells/abap/Fiorilaunchpad.html?sap-theme=sap_belize@http://ci3s4hanaprda.local.tmg.dom:8000/sap/public/bc/themes/~client-100#ZCICREVSO_SALESMAN-display?sap-ui-tech-hint=TR",
        "_blank"
      );
    }
    if (data == "VSO Stats") {
      window.open(
        "https://sapprd.tmg.com.eg:44300/fiori/shells/abap/Fiorilaunchpad.html?sap-theme=sap_belize@http://ci3s4hanaprda.local.tmg.dom:8000/sap/public/bc/themes/~client-100#ZCICREVSO_STATS-display?sap-ui-tech-hint=TR",
        "_blank"
      );
    }
    if (data == "VSO Stats – Day") {
      window.open(
        "http://CI3BODEV.local.tmg.dom:8080/BOE/OpenDocument/opendoc/openDocument.jsp?sIDType=CUID&iDocID=FnXh.QBuyAgA9J4BAAAXHT0EAFBWsxy.",
        "_blank"
      );
    }
    if (data == "VSO Stats – Country") {
      window.open(
        "http://CI3BODEV.local.tmg.dom:8080/BOE/OpenDocument/opendoc/openDocument.jsp?sIDType=CUID&iDocID=Fu7q.QCk1QoA9J4BAAD3.j4EAFBWsxy.",
        "_blank"
      );
    }
    if (data == "Exchange Units Report") {
      window.open(
        "http://CI3BODEV.local.tmg.dom:8080/BOE/OpenDocument/opendoc/openDocument.jsp?sIDType=CUID&iDocID=FkvR.wCj_QgA9J4BAAAnLj4EAFBWsxy.",
        "_blank"
      );
    }
    if (data == "Admin Panel") {
      window.open(
        "http://CI3BODEV.local.tmg.dom:8080/BOE/OpenDocument/opendoc/openDocument.jsp?sIDType=CUID&iDocID=FgfS.wDKggwA9J4BAADn7j4EAFBWsxy.",
        "_blank"
      );
    }
    if (data == "VSO Opportunities Report") {
      window.open(
        "https://my347652.crm.ondemand.com/sap/ap/ui/clogin?saml2=disabled&app.component=%2fSAP_UI_CT%2fMain%2froot.uiccwoc&rootWindow=X&redirectUrl=%2fsap%2fpublic%2fbyd%2fruntime#Nav/1/eyJzb3VyY2UiOiIzJC9TQVBfQllEX1RGL0FuYWx5dGljcy9LZXlVc2VyQW5hbHl0aWNzL2FuYV9yZXBvcnRfbGlzdF9rdWEuT1dMLnVpY29tcG9uZW50IiwidGFyZ2V0IjoiL1NBUF9CWURfVEYvQW5hbHl0aWNzL0FuYWx5c2lzUGF0dGVybi9BTkFfQVBfU3RhbmRhbG9uZS5RQS51aWNvbXBvbmVudCIsImluUG9ydCI6IkFuYWx5c2lzUGF0dGVybiIsImxpc3RzIjp7fSwicGFyYW1zIjp7IlJlcG9ydElkIjp7InZhbHVlIjoiWkYyNjI5QzRGMjBCMEE5QzZDQkUyOUIifSwiS1VBTW9kZSI6eyJjb25zdGFudCI6IlgifSwiU2NlbmFyaW8iOnsidmFsdWUiOiJBUCJ9LCJSZXBvcnRUeXBlIjp7InZhbHVlIjoiMDEifX0sIndpbklkIjoiZDc1NzU4YWEwODEzMGRjYjA2MWNiMGI4ZjFkNWNlMzcifQ==",
        "_blank"
      );
    }
    if (data == "VSO Customer Sales Report") {
      window.open(
        "https://sapprd.tmg.com.eg:44300/fiori/shells/abap/Fiorilaunchpad.html?sap-theme=sap_belize%40http%3a%2f%2fci3s4hanaprda.local.tmg.dom%3a8000%2fsap%2fpublic%2fbc%2fthemes%2f%7eclient-100#CICRE_E_CUST_SALES-display",
        "_blank"
      );
    }
    if (data == "Registration Per Country & UTM") {
      window.open(
        "https://sapprd.tmg.com.eg:44300/fiori/shells/abap/Fiorilaunchpad.html?sap-theme=sap_belize%40http%3a%2f%2fci3s4hanaprda.local.tmg.dom%3a8000%2fsap%2fpublic%2fbc%2fthemes%2f%7eclient-100#CICRE_REG_COUNTRY-display",
        "_blank"
      );
    }
    if (data == "Sales Per Country & UTM") {
      window.open(
        "https://sapprd.tmg.com.eg:44300/fiori/shells/abap/Fiorilaunchpad.html?sap-theme=sap_belize%40http%3a%2f%2fci3s4hanaprda.local.tmg.dom%3a8000%2fsap%2fpublic%2fbc%2fthemes%2f%7eclient-100#CICRE_SALES_COUNTRY-display",
        "_blank"
      );
    }
  }
}
