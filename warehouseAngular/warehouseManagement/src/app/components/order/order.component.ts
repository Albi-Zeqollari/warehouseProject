import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrderDto } from 'src/app/models/Dtos/OrderDto';
import { Order } from 'src/app/models/order.interface';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, AfterViewInit, OnDestroy {
  currentUser!: User;
  orders!: any;
  filteredOrder: OrderDto[] = [];
  filterStatus: string = 'All';
  displayedColumns: string[] = [
    'orderNumber',
    'submittedDate',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>(this.orders);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userSub = this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.loadOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch current user:', err);
        this.snackBar.open('Failed to fetch current user', 'Close', {
          duration: 3000,
        });
      },
    });
    this.subscriptions.add(userSub);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadOrders(): void {
    const ordersSub = this.orderService.viewMyOrders(this.currentUser.id).subscribe({
      next: (orders: any[]) => {
        this.orders = orders;
        this.applyClientFilter();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch orders:', err);
        this.snackBar.open('Failed to fetch orders', 'Close', {
          duration: 3000,
        });
      },
    });
    this.subscriptions.add(ordersSub);
  }

  applyClientFilter(): void {
    this.filteredOrder = this.orders.filter(
      (order: any) =>
        this.filterStatus === 'All' || order.status === this.filterStatus
    );
    this.dataSource.data = this.filteredOrder;
  }

  createOrder(): void {
    this.snackBar.open('Navigating to create order page', 'Close', {
      duration: 3000,
    });
    this.router.navigateByUrl('/create-orders');
  }

  editOrder(order: Order): void {
    this.snackBar.open('Navigating to edit order page', 'Close', {
      duration: 3000,
    });
    this.router.navigateByUrl(`orders/${order.id}`);
  }

  cancelOrder(order: Order): void {
    order.status = 'CANCELED';
    const cancelSub = this.orderService.changeOrderStatus(order).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to change order status:', err);
        this.snackBar.open('Failed to cancel order', 'Close', {
          duration: 3000,
        });
      },
    });
    this.subscriptions.add(cancelSub);
  }

  changeStatus(order: Order): void {
    order.status = 'AWAITING_APPROVAL';
    const statusSub = this.orderService.changeOrderStatus(order).subscribe({
      next: () => {
        this.snackBar.open('Order status updated successfully', 'Close', {
          duration: 3000,
        });
        this.loadOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to change order status:', err);
        this.snackBar.open('Failed to update order status', 'Close', {
          duration: 3000,
        });
      },
    });
    this.subscriptions.add(statusSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
