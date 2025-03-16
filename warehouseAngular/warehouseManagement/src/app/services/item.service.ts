import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/assets/enviroment';
import { Item } from '../models/item.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;

  getAllItems() {
    const url = `${this.baseUrl}/api/manager/items`;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<Item[]>(url, { headers });
  }

  createItem(item: Item): Observable<void> {
    const url = `${this.baseUrl}/api/manager/items`;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<void>(url, item, { headers });
  }

  updateItem(item: Item){
    const url = `${this.baseUrl}/api/manager/items/update`;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.put(url, item, { headers });
  }

  deleteItem(id: number) {
    const token = localStorage.getItem('token');
    const url = `${this.baseUrl}/api/manager/items/${id}`;
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.delete(url, { headers, responseType: 'text' });
  }

}
