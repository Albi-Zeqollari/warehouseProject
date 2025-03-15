// auth.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/assets/enviroment';
import {
  defer,
  filter,
  interval,
  Observable,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.apiUrl;

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/register`, user);
  }
  login(username: any, password: any): Observable<{ token: string }> {
    const body = { username, password };
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/api/auth/login`, body)
      .pipe(
        tap((response) => {
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
        return this.http.get(
          `${this.baseUrl}/api/system-admin/users/currentUser`,
          { headers }
        );
      } else {
        return interval(500).pipe(
          filter(() => !!localStorage.getItem('token')),
          take(1),
          switchMap(() => {
            const newToken = localStorage.getItem('token');
            const headers = new HttpHeaders({
              Authorization: `Bearer ${newToken}`,
            });
            return this.http.get(
              `${this.baseUrl}/api/system-admin/users/currentUser`,
              { headers }
            );
          })
        );
      }
    });
  }
  logout(): void {
    localStorage.removeItem('token');
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getAllUsers() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get(`${this.baseUrl}/api/system-admin/users`, { headers });
  }

  updateUser(user: any) {
    const token = localStorage.getItem('token');
    const url = `${this.baseUrl}/api/system-admin/users/update`;
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.put(url, user, { headers, responseType: 'text' });
  }

  deleteUser(id: number) {
    const token = localStorage.getItem('token');
    const url = `${this.baseUrl}/api/system-admin/users/${id}`;
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.delete(url, { headers, responseType: 'text' });
  }
}
