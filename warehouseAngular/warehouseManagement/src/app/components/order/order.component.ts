import { HttpErrorResponse } from '@angular/common/http';
import {  AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { OrderDto } from 'src/app/models/Dtos/OrderDto';
import { UserDto } from 'src/app/models/Dtos/UserDto';
import { Order } from 'src/app/models/order.interface';
import { OrderStatus } from 'src/app/models/orderStatus.enum';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent  implements OnInit {
  currentUser!: User;
  orders: OrderDto[] = [];
  filteredOrder: OrderDto[] = [];
  filterStatus: string = 'All'; // default filter

  // Add "actions" to the displayed columns array
  displayedColumns: string[] = [
    'orderNumber',
    'submittedDate',
    'status',
    'deadlineDate',
    'client',
    'declineReason',
    'actions'
  ];


  constructor(
    private router:Router,
    private orderService:OrderService,
    private authService:AuthService
  ) {}

  ngOnInit(): void {

    this.authService.getCurrentUser().pipe(
      switchMap((user: any) => {
        this.currentUser = user
        return this.orderService.viewMyOrders(this.currentUser.id);
      })
    ).subscribe({
      next: (orders: any[]) => {
        this.orders = orders;
        this.applyClientFilter();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch current user or orders:', err);
      }
    });

  }




  applyClientFilter(): void {
    this.filteredOrder = this.orders.filter(order =>
      order.client.username === this.currentUser.username &&
      (this.filterStatus === 'All' || order.status === this.filterStatus)
    );
  }
  createOrder(): void {
    this.router.navigateByUrl("/create-orders")
  }


  viewOrder(order: Order): void {
    console.log('View order', order);
    // Implement view logic, e.g., navigate to a detailed view page
  }

  editOrder(order: Order): void {
    console.log('Edit order', order);
    // Implement edit logic, e.g., navigate to an order edit page or open an edit dialog
  }

  deleteOrder(order: Order): void {
    console.log('Delete order', order);
    // Implement delete logic, such as calling your API to remove the order
  }

  changeStatus(order: Order): void {
    console.log('Change status for order', order);
    // Implement change status logic, such as opening a dialog to select a new status
  }
}
