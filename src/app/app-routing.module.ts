import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./core/guards/auth.guard";
import { LoginGuard } from "./core/guards/login.guard";
import { PermissionGuard } from "./core/guards/permission.guard";

// For permissions guard, "SH_AL" is access all permission and is by default valid so no need to add it to the valid perms array
const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/login",
  },

  {
    path: "login",
    loadChildren: () => import("./modules/login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "home",
    loadChildren: () => import("./modules/home/home.module").then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: "otp-finder",
    loadChildren: () => import("./modules/otp-finder/otp-finder.module").then((m) => m.OtpFinderModule),
    canActivate: [AuthGuard, PermissionGuard],
    data: { validPerms: ["MONITOR_TILE"] },
  },
  {
    path: "approval",
    loadChildren: () => import("./modules/approval/bank-approval.module").then((m) => m.BankApprovalModule),
    canActivate: [AuthGuard, PermissionGuard],
    data: { validPerms: ["BANK_TRANSFER_TILE"] },
  },
  {
    path: "visa",
    loadChildren: () => import("./modules/visa/visa.module").then((m) => m.VisaModule),
    canActivate: [AuthGuard, PermissionGuard],
    data: { validPerms: ["VISA_TILE"] },
  },
  {
    path: "authorization",
    loadChildren: () => import("./modules/authorization/authorization.module").then((m) => m.AuthorizationModule),
    canActivate: [AuthGuard, PermissionGuard],
    data: { validPerms: ["AUTH_TILE"] },
  },
  {
    path: "sales-report",
    loadChildren: () => import("./modules/sales-report/sales-report.module").then((m) => m.SalesReportModule),
    canActivate: [AuthGuard, PermissionGuard],
    data: { validPerms: ["REPORTS_TILE"] },
  },
  {
    path: "monitor",
    loadChildren: () => import("./modules/monitor-queue/monitor-queue.module").then((m) => m.MonitorQueueModule),
    canActivate: [AuthGuard, PermissionGuard],
    data: { validPerms: ["MONITOR_TILE"] },
  },
  {
    path: "operations",
    loadChildren: () => import("./modules/admin-operations-home/admin-operations-home.module").then((m) => m.AdminOperationsHomeModule),
    canActivate: [AuthGuard, PermissionGuard],
    data: { validPerms: ["OPERATION"] },
  },
  {
    path: "admin-operations",
    loadChildren: () => import("./modules/admin-operations/admin-operations.module").then((m) => m.AdminOperationsModule),
    canActivate: [AuthGuard, PermissionGuard],
    data: { validPerms: ["OPERATION"] },
  },
  // { path: "feedback", loadChildren: () => import("./modules/sales-feedback/sales-feedback.module").then((m) => m.SalesFeedbackModule) },
  {
    path: "failed-payments",
    loadChildren: () => import("./modules/failed-payments/failed-payments.module").then((m) => m.FailedPaymentsModule),
  },
  // { path: 'utm', loadChildren: () => import('./modules/find-utm/find-utm.module').then(m => m.FindUtmModule) },
  { path: "reports", loadChildren: () => import("./modules/report/report.module").then((m) => m.ReportModule) },

  { path: "offer", loadChildren: () => import("./modules/offer/offer.module").then((m) => m.OfferModule) },
  { path: 'appointment-history', loadChildren: () => import('./modules/appointment-history/appointment-history.module').then(m => m.AppointmentHistoryModule) },

  {
    path: "**",
    loadChildren: () => import("./modules/not-found/not-found.module").then((m) => m.NotFoundModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
