import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, switchMap } from 'rxjs';
import { OrderDto } from 'src/app/models/Dtos/OrderDto';
import { Order } from 'src/app/models/order.interface';
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
  filterStatus: string = 'All';
  displayedColumns: string[] = [
    'orderNumber',
    'submittedDate',
    'status',
    'deadlineDate',
    'actions'
  ];
  constructor(
    private router:Router,
    private orderService:OrderService,
    private authService:AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        // Once we have the user, load their orders
        this.loadOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch current user:', err);
      }
    });
  }


  // order.component.ts
loadOrders(): void {
  this.orderService.viewMyOrders(this.currentUser.id).subscribe({
    next: (orders: OrderDto[]) => {
      this.orders = orders;
      this.applyClientFilter(); // apply the status filter
    },
    error: (err: HttpErrorResponse) => {
      console.error('Failed to fetch orders:', err);
    }
  });
}

  applyClientFilter(): void {
    this.filteredOrder = this.orders.filter(order =>
      (this.filterStatus === 'All' || order.status === this.filterStatus)
    );
  }
  createOrder(): void {
    this.router.navigateByUrl("/create-orders")
  }

  viewOrder(order: Order): void {
    console.log('View order', order);
  }

  editOrder(order: Order): void {
    console.log('Edit order', order);
  }

  cancelOrder(order: Order): void {
    console.log('Delete order', order);
  }

  changeStatus(order: Order): void {
    order.status = "AWAITING_APPROVAL"; // or the new status you want
    this.orderService.changeOrderStatus(order).subscribe({
      next: () => {
        // Once the status change is successful, reload orders
        this.loadOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to change order status:', err);
      }
    });
  }

}
