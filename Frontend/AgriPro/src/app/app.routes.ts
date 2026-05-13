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

export const routes: Routes = [
  { path: '', component: Home,/*canActivate:[authGuard] */},
  { path: 'home', component: Home ,/*canActivate:[authGuard]*/},
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'register', component: Register },
  { path: 'admin', component: Admin  ,canActivate:[authGuard,roleGuard],data:{role:'Admin'} },
  { path: 'expert', component: Expert , canActivate: [authGuard, roleGuard], data: { role: 'Expert' }},
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
  { path: 'investor', component: Investor , canActivate: [authGuard, roleGuard], data: { role: 'Investor' } }
  



];
