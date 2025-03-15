import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderItem } from '../models/orderItem.inteface';
import { Truck } from '../models/truck.interface';
import { OrderDto } from '../models/Dtos/OrderDto';
import { environment } from 'src/assets/enviroment';;
import { Order } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createOrder(order: Order){
    const url = `${this.baseUrl}/api/create/orders`;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(url, order, { headers });
  }
  viewMyOrders(id: number): Observable<OrderDto[]> {
    const url = `${this.baseUrl}/api/client/my-orders/${id}`;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<OrderDto[]>(url, { headers });
  }

  getAllOrdersForManager(): Observable<OrderDto[]> {
    const url = `${this.baseUrl}/api/manager/orders`;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<OrderDto[]>(url, { headers });
  }

  changeOrderStatus(order: Order){
    const url = `${this.baseUrl}/api/order/updateStatus`;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.put(url, order, { headers });
  }

}
