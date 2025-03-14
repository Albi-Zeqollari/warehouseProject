// auth.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/assets/enviroment';
import { defer, filter, interval, Observable, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;

  register(username: string, password: string, role: string): Observable<any> {
    const body = { username, password, role };
    return this.http.post(`${this.baseUrl}/api/auth/register`, body);
  }

  login(username: any, password: any): Observable<{ token: string }> {
    const body = { username, password };
    return this.http.post<{ token: string }>(`${this.baseUrl}/api/auth/login`, body)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  getCurrentUser(): Observable<any> {
    return defer(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get(`${this.baseUrl}/api/system-admin/users/currentUser`, { headers });
      } else {
        return interval(500).pipe(
          filter(() => !!localStorage.getItem('token')),
          take(1),
          switchMap(() => {
            const newToken = localStorage.getItem('token');
            const headers = new HttpHeaders({ Authorization: `Bearer ${newToken}` });
            return this.http.get(`${this.baseUrl}/api/system-admin/users/currentUser`, { headers });
          })
        );
      }
    });
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user')
  }

  // Helper method to check authentication status
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
