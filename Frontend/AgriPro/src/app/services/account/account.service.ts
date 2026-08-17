import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { UserProfile } from '../../models/user-profile';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AccountSettings, ChangePasswordRequest, UpdateProfileRequest } from '../../models/user-settings';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.baseUrl}/api/Account/me`);
  }

  updateProfile(data: UpdateProfileRequest): Observable<any> {
    return this.http.put(`${environment.baseUrl}/api/Account/profile`, data);
  }

  changePassword(data: ChangePasswordRequest): Observable<any> {
    return this.http.put(`${environment.baseUrl}/api/Account/change-password`, data);
  }

  getAccountSettings(): Observable<AccountSettings> {
    return this.http.get<AccountSettings>(`${environment.baseUrl}/api/Account/settings`);
  }

  updateAccountSettings(settings: AccountSettings): Observable<AccountSettings> {
    return this.http.put<AccountSettings>(`${environment.baseUrl}/api/Account/settings`, settings);
  }
  
}
