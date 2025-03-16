import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrderDto } from 'src/app/models/Dtos/OrderDto';
import { Order } from 'src/app/models/order.interface';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewOrderComponent } from '../view-order/view-order.component';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss'],
})
export class WarehouseComponent implements OnInit,AfterViewInit {
  currentUser!: User;
  orders: any[] = [];
  filterStatus: string = 'All';
  filteredOrder!: OrderDto[];
  readonly dialog = inject(MatDialog);
  declineReasonVisibleId: number | null = null;
  // A map of FormControls for each order's decline reason
  declineReasonControlMap: { [orderId: number]: FormControl } = {};
  displayedColumns: string[] = [
    'orderNumber',
    'submittedDate',
    'status',
    'deadlineDate',
    'client',
    'actions',
  ];
    dataSource = new MatTableDataSource<Order>(this.orders);
    @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.loadManagerOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch current user:', err);
      }
    });
  }
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }


  loadManagerOrders(){
    this.orderService.getAllOrdersForManager().subscribe({
      next: (orders: OrderDto[]) => {
        this.orders = orders;
        this.dataSource.data = this.orders
        this.applyClientFilter();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch orders:', err);
      }
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

  approveOrder(order: Order): void {
    order.status = "APPROVED";
    this.orderService.changeOrderStatus(order).subscribe({
      next: () => {
        this.loadManagerOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to change order status:', err);
      }
    });
  }

  getDeclineReasonControl(orderId: number): FormControl {
    if (!this.declineReasonControlMap[orderId]) {
      this.declineReasonControlMap[orderId] = new FormControl('');
    }
    return this.declineReasonControlMap[orderId];
  }

  showDeclineReason(order: any): void {
    this.declineReasonVisibleId = order.id;
    this.getDeclineReasonControl(order.id);
  }

  cancelDecline(): void {
    this.declineReasonVisibleId = null;
  }

  confirmDecline(order: any): void {
    const reasonControl = this.getDeclineReasonControl(order.id);
    const typedReason = reasonControl.value;

    order.status = 'DECLINED';
    order.declineReason = typedReason;

    this.orderService.changeOrderStatus(order).subscribe(() => {
      this.loadManagerOrders();
    });

    this.declineReasonVisibleId = null;
  }
  goToItems(){
    this.router.navigateByUrl("manage-items")
  }
}
