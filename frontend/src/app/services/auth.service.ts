import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth'; // proxied to backend

  constructor(private http: HttpClient) {}

  // ---- Authentication methods ----
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  signup(full_name: string, email: string, password: string, region: string, organization: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, {
      full_name,
      email,
      password,
      region,
      organization
    });
  }

  me(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  // ---- Token management ----
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
