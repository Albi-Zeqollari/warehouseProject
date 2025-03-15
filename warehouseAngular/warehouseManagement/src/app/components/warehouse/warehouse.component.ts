import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { OrderDto } from 'src/app/models/Dtos/OrderDto';
import { Order } from 'src/app/models/order.interface';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewOrderComponent } from '../view-order/view-order.component';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss'],
})
export class WarehouseComponent implements OnInit {
  currentUser!: User;
  orders: OrderDto[] = [];
  filterStatus: string = 'All';
  filteredOrder!: OrderDto[];
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = [
    'orderNumber',
    'submittedDate',
    'status',
    'deadlineDate',
    'client',
    'actions',
  ];

  // Trucks related properties
  trucks: any[] = [];
  truckDisplayedColumns: string[] = [
    'truckNumber',
    'licensePlate',
    'capacity',
    'status',
    'actions',
  ];
  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService
      .getCurrentUser()
      .pipe(
        switchMap((user: any) => {
          this.currentUser = user;
          return this.orderService.getAllOrdersForManager();
        })
      )
      .subscribe({
        next: (orders: any[]) => {
          this.orders = orders;
          console.log(orders);

          this.applyClientFilter();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to fetch current user or orders:', err);
        },
      });
  }
  applyClientFilter(): void {
    this.filteredOrder = this.orders
      .filter(
        (order) =>
          this.filterStatus === 'All' || order.status === this.filterStatus
      )
      .sort(
        (a, b) =>
          new Date(b.submittedDate!).getTime() -
          new Date(a.submittedDate!).getTime()
      );
  }

  viewOrder(order: Order): void {
    const dialogRef = this.dialog.open(ViewOrderComponent, {
      data: order,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  changeStatus(order: Order): void {
    console.log('Change status for order', order);
  }

  goToItems(){
    this.router.navigateByUrl("manage-items")
  }
}
