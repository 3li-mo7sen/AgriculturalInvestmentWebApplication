import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { ExpertDashboard } from './components/expert-dashboard/expert-dashboard';
import { authGuard } from './guards/auth/auth-guard';
import { roleGuard } from './guards/role/role-guard';
import { loginGuard } from './guards/login/login-guard';

export const routes: Routes = [
  { path: '', component: Home,canActivate:[authGuard] },
  { path: 'home', component: Home ,canActivate:[authGuard]},
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'register', component: Register },
  { path: 'admin', component: AdminDashboard,canActivate:[authGuard,roleGuard],data:{role:'Admin'} },
  { path: 'expert', component: ExpertDashboard, canActivate: [authGuard, roleGuard],data:{role:'Expert'} }
  



];
