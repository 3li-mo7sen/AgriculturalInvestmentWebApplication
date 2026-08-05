import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { UserProfile } from '../../models/user-profile';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.baseUrl}/api/Account/me`);
  }
  
}
