import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/assets/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ScheduleDeliveryService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;

  scheduleDelivery(payload: any): Observable<any> {
    const url = `${this.baseUrl}/api/deliveries/schedule`;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post(url, payload, { headers, responseType: 'text' });
  }

}
