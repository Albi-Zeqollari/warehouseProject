import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderItem } from '../models/orderItem.inteface';
import { OrderStatus } from '../models/orderStatus.enum';
import { Truck } from '../models/truck.interface';
import { OrderDto } from '../models/Dtos/OrderDto';
import { environment } from 'src/assets/enviroment';
import { User } from '../models/user.interface';
import { UserDto } from '../models/Dtos/UserDto';
import { Order } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }



  createOrder(order: Order): Observable<void> {

    const url = `${this.baseUrl}/api/create/orders`;

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<void>(url, order, { headers });
  }


  addItemToOrder(orderId: string, orderItem: OrderItem): Observable<OrderDto> {
    const url = `${this.baseUrl}/client/orders/${orderId}/addItem`;
    return this.http.put<OrderDto>(url, orderItem);
  }


  removeItemFromOrder(orderId: string, orderItemId: string): Observable<void> {
    const url = `${this.baseUrl}/client/orders/${orderId}/removeItem/${orderItemId}`;
    return this.http.put<void>(url, null);
  }

  cancelOrder(orderId: string): Observable<void> {
    const url = `${this.baseUrl}/client/orders/${orderId}/cancel`;
    return this.http.put<void>(url, null);
  }


  submitOrder(orderId: string): Observable<void> {
    const url = `${this.baseUrl}/client/orders/${orderId}/submit`;
    return this.http.put<void>(url, null);
  }


  viewMyOrders(id: number): Observable<OrderDto[]> {
    const url = `${this.baseUrl}/api/client/my-orders`;
    let params = new HttpParams().set('username', id);
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<OrderDto[]>(url, { params, headers });
  }


  getAllOrdersForManager(status?: OrderStatus): Observable<OrderDto[]> {
    const url = `${this.baseUrl}/manager/orders`;
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<OrderDto[]>(url, { params });
  }


  getOrderDetail(orderId: string): Observable<OrderDto> {
    const url = `${this.baseUrl}/manager/orders/${orderId}`;
    return this.http.get<OrderDto>(url);
  }


  approveOrder(orderId: string): Observable<void> {
    const url = `${this.baseUrl}/manager/orders/${orderId}/approve`;
    return this.http.put<void>(url, null);
  }

  declineOrder(orderId: string, reason: string): Observable<void> {
    const url = `${this.baseUrl}/manager/orders/${orderId}/decline`;
    return this.http.put<void>(url, reason);
  }


  scheduleDelivery(orderId: string, trucks: Truck[]): Observable<void> {
    const url = `${this.baseUrl}/manager/orders/${orderId}/scheduleDelivery`;
    return this.http.put<void>(url, trucks);
  }

  fulfillOrder(orderId: string): Observable<void> {
    const url = `${this.baseUrl}/manager/orders/${orderId}/fulfill`;
    return this.http.put<void>(url, null);
  }
}
