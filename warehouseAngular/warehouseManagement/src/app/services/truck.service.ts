import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/assets/enviroment';
import { Item } from '../models/item.interface';
import { Truck } from '../models/truck.interface';

@Injectable({
  providedIn: 'root'
})
export class TruckService {
 constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;

  getAllTrucks() {
    const url = `${this.baseUrl}/api/manager/trucks`;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<Truck[]>(url, { headers });
  }

  createTruck(truck: Truck): Observable<void> {
    const url = `${this.baseUrl}/api/manager/trucks`;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<void>(url, truck, { headers });
  }

  updateTruck(truck: Truck){
    const url = `${this.baseUrl}/api/manager/trucks/updateTruck`;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.put(url, truck, { headers });
  }

  delteTruck(id: number) {
    const token = localStorage.getItem('token');
    const url = `${this.baseUrl}/api/manager/trucks/${id}`;
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.delete(url, { headers, responseType: 'text' });
  }
}
