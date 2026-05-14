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

export const routes: Routes = [
  { path: '', component: Home,/*canActivate:[authGuard] */},
  { path: 'home', component: Home ,/*canActivate:[authGuard]*/},
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'register', component: Register },
  { path: 'admin', component: Admin  ,canActivate:[authGuard,roleGuard],data:{role:'Admin'} },
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
      { path: 'create-project', component: CreateProject }, 
      { path: 'my-projects', component: MyProjects },
      { path: 'contracts', component: Contracts },       
      { path: 'wallet', component: Wallet },           
      {
        path: 'settings', component: Settings,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' }, // لو دخل سيتنجز بس يفتح بروفايل
          { path: 'profile', component: ProfileFarmer},
          { path: 'security', component: SecurityFarmer },
          { path: 'notifications', component: NotificationsFarmer },
          { path: 'preferences', component: PreferencesFarmer }
        ]
},         
    ]  },
  {
    path: 'investor', component: Investor, canActivate: [authGuard, roleGuard], data: { role: 'Investor' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: InvestorDashboard },
      { path: 'available-projects', component:InvestorProjects  },
      { path: 'my-investments', component: InvestorInvestments },
      { path: 'investment-history', component: InvestorHistory },
      { path: 'wallet', component: InvestorWallet },
      {
        path: 'settings', component: InvestorSettings,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' }, // لو دخل سيتنجز بس يفتح بروفايل
          { path: 'profile', component:  ProfileInvestor},
          { path: 'security', component: SecurityInvestor },
          { path: 'notifications', component: NotificationsInvestor },
          { path: 'preferences', component: PreferencesInvestor }
        ]
      }
      ]
  }
  ,
  { path: 'forget-password', component: ForgetPassword },
  {path:'reset-password',component:ResetPassword}
  



];
