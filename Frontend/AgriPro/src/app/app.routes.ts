import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';


import { authGuard } from './guards/auth/auth-guard';
import { roleGuard } from './guards/role/role-guard';
import { loginGuard } from './guards/login/login-guard';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email';
import { Admin } from './components/admin/admin';
import { Expert } from './components/expert/expert';
import { Farmer } from './components/farmer/farmer';
import { Investor } from './components/investor/investor';
import { FarmerDashboard } from './components/farmer/components/farmer-dashboard/farmer-dashboard';
import { CreateProject } from './components/farmer/components/create-project/create-project';
import { MyProjects } from './components/farmer/components/my-projects/my-projects';
import { Contracts } from './components/farmer/components/contracts/contracts';
import { Wallet } from './components/farmer/components/wallet/wallet';
import { Settings } from './components/farmer/components/settings/settings';
import { ProfileFarmer } from './components/farmer/components/settings/components/profile-farmer/profile-farmer';
import { SecurityFarmer } from './components/farmer/components/settings/components/security-farmer/security-farmer';
import { NotificationsFarmer } from './components/farmer/components/settings/components/notifications-farmer/notifications-farmer';
import { PreferencesFarmer } from './components/farmer/components/settings/components/preferences-farmer/preferences-farmer';
import { InvestorDashboard } from './components/investor/components/investor-dashboard/investor-dashboard';
import { InvestorProjects } from './components/investor/components/investor-projects/investor-projects';
import { InvestorInvestments } from './components/investor/components/investor-investments/investor-investments';
import { InvestorWallet } from './components/investor/components/investor-wallet/investor-wallet';
import { InvestorSettings } from './components/investor/components/investor-settings/investor-settings';
import { InvestorHistory } from './components/investor/components/investor-history/investor-history';
import { ProfileInvestor } from './components/investor/components/investor-settings/components/profile-investor/profile-investor';
import { SecurityInvestor } from './components/investor/components/investor-settings/components/security-investor/security-investor';
import { NotificationsInvestor } from './components/investor/components/investor-settings/components/notifications-investor/notifications-investor';
import { PreferencesInvestor } from './components/investor/components/investor-settings/components/preferences-investor/preferences-investor';
import { ForgetPassword } from './components/forget-password/forget-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { ExpertDashboard } from './components/expert/components/expert-dashboard/expert-dashboard';
import { ExpertReviews } from './components/expert/components/expert-reviews/expert-reviews';
import { ExpertVerified } from './components/expert/components/expert-verified/expert-verified';
import { ExpertRejected } from './components/expert/components/expert-rejected/expert-rejected';
import { ExpertSettings } from './components/expert/components/expert-settings/expert-settings';
import { ExpertSettingsProfile } from './components/expert/components/expert-settings/components/expert-settings-profile/expert-settings-profile';
import { ExpertSettingsSecurity } from './components/expert/components/expert-settings/components/expert-settings-security/expert-settings-security';
import { ExpertSettingsNotifications } from './components/expert/components/expert-settings/components/expert-settings-notifications/expert-settings-notifications';
import { ExpertSettingsPreferences } from './components/expert/components/expert-settings/components/expert-settings-preferences/expert-settings-preferences';
import { AdminDashboard } from './components/admin/components/admin-dashboard/admin-dashboard';
import { AdminAccounts } from './components/admin/components/admin-accounts/admin-accounts';
import { AdminDocuments } from './components/admin/components/admin-documents/admin-documents';
import { AdminReports } from './components/admin/components/admin-reports/admin-reports';
import { AdminSettings } from './components/admin/components/admin-settings/admin-settings';
import { AdminSettingsPayments } from './components/admin/components/admin-settings/components/admin-settings-payments/admin-settings-payments';
import { AdminSettingsSecurity } from './components/admin/components/admin-settings/components/admin-settings-security/admin-settings-security';
import { AdminSettingsNotification } from './components/admin/components/admin-settings/components/admin-settings-notification/admin-settings-notification';
import { AdminSettingsGeneral } from './components/admin/components/admin-settings/components/admin-settings-general/admin-settings-general';
import { AdminReportsAlerts } from './components/admin/components/admin-reports/components/admin-reports-alerts/admin-reports-alerts';
import { AdminReportsReports } from './components/admin/components/admin-reports/components/admin-reports-reports/admin-reports-reports';
import { FarmerProfile2 } from './components/farmer/components/farmer-profile2/farmer-profile2';
import { AddProjectForm } from './components/farmer/components/create-project/components/add-project-form/add-project-form';
import { CreateProjectForms } from './components/farmer/components/create-project/components/create-project-forms/create-project-forms';
import { ProjectDetails } from './components/project-details/project-details';
import { InvestorProfile2 } from './components/investor/components/investor-profile2/investor-profile2';

export const routes: Routes = [
  { path: '', component: Home,/*canActivate:[authGuard] */},
  { path: 'home', component: Home ,/*canActivate:[authGuard]*/},
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'register', component: Register },
  {
    path: 'admin', component: Admin, canActivate: [authGuard, roleGuard], data: { role: 'Admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'manage-accounts', component:  AdminAccounts},
      { path: 'approve-documents', component: AdminDocuments },
      {
        path: 'reports', component: AdminReports,
        children: [
          { path: '', redirectTo: 'reports', pathMatch: 'full' }, // لو دخل سيتنجز بس يفتح بروفايل
          { path: 'reports', component: AdminReportsReports },
          { path: 'alerts', component: AdminReportsAlerts },
        ]
      },
      
      {
        path: 'settings', component: AdminSettings,
        children: [
          { path: '', redirectTo: 'general', pathMatch: 'full' }, // لو دخل سيتنجز بس يفتح بروفايل
          { path: 'general', component: AdminSettingsGeneral },
          { path: 'notifications', component: AdminSettingsNotification },
          { path: 'security', component: AdminSettingsSecurity },
          { path: 'payments', component: AdminSettingsPayments }
        ]
      }
    ]
  },
  {
    path: 'expert', component: Expert, canActivate: [authGuard, roleGuard], data: { role: 'Expert' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ExpertDashboard },
      { path: 'pending-reviews', component: ExpertReviews },
      { path: 'verified-projects', component: ExpertVerified },
      { path: 'rejected-projects', component: ExpertRejected },
      
      {
        path: 'settings', component: ExpertSettings,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' }, // لو دخل سيتنجز بس يفتح بروفايل
          { path: 'profile', component:  ExpertSettingsProfile},
          { path: 'security', component: ExpertSettingsSecurity },
          { path: 'notifications', component: ExpertSettingsNotifications },
          { path: 'preferences', component: ExpertSettingsPreferences }
        ]
      }
    ]
  },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  {
    path: 'farmer', component: Farmer, canActivate: [authGuard, roleGuard], data: { role: 'Farmer' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: FarmerDashboard },
      { path: 'create-project', component:  CreateProjectForms}, 
      { path: 'my-projects', component: MyProjects },
      { path: 'contracts', component: Contracts },       
      { path: 'profile', component: FarmerProfile2 },
      { path: 'project-details/:id', component: ProjectDetails },
      { path: 'wallet', component: Wallet },
      

     /* {
        path: 'settings', component: Settings,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' }, 
          { path: 'profile', component: ProfileFarmer},
        
         
        ]
},*/ 
    
    ]  },
  {
    path: 'investor', component: Investor, canActivate: [authGuard, roleGuard], data: { role: 'Investor' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: InvestorDashboard },
      { path: 'available-projects', component:InvestorProjects  },
      { path: 'my-investments', component: InvestorInvestments },
      { path: 'investment-history', component: InvestorHistory },
      
      {path:'profile',component:InvestorProfile2}
      ]
  }
  ,
  { path: 'forget-password', component: ForgetPassword },
  { path: 'reset-password', component: ResetPassword },
  {path:'project-details/:id' ,component:ProjectDetails}
  



];
