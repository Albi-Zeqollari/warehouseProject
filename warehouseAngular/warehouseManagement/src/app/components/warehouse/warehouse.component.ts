import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
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
import { Subscription } from 'rxjs';
import { ScheduleDeliveryComponent } from '../schedule-delivery/schedule-delivery.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss'],
})
export class WarehouseComponent implements OnInit, AfterViewInit, OnDestroy {
  currentUser!: User;
  orders: any[] = [];
  filterStatus: string = 'All';
  filteredOrder!: OrderDto[];
  readonly dialog = inject(MatDialog);
  declineReasonVisibleId: number | null = null;
  declineReasonControlMap: { [orderId: number]: FormControl } = {};
  displayedColumns: string[] = [
    'orderNumber',
    'submittedDate',
    'status',
    'deadlineDate',
    'client',
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
        this.loadManagerOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch current user:', err);
      },
    });
    this.subscriptions.add(userSub);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadManagerOrders(): void {
    const ordersSub = this.orderService.getAllOrdersForManager().subscribe({
      next: (orders: any[]) => {
        this.orders = orders;
        this.applyClientFilter();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch orders:', err);
      },
    });
    this.subscriptions.add(ordersSub);
  }

  applyClientFilter(): void {
    this.filteredOrder = this.orders
      .filter(
        (order: any) =>
          this.filterStatus === 'All' || order.status === this.filterStatus
      )
      .sort(
        (a, b) =>
          new Date(b.submittedDate!).getTime() -
          new Date(a.submittedDate!).getTime()
      );
    this.dataSource.data = this.filteredOrder;
  }

  viewOrder(order: Order): void {
    const dialogRef = this.dialog.open(ViewOrderComponent, {
      data: order,
    });
    const dialogSub = dialogRef.afterClosed().subscribe(() => {});
    this.subscriptions.add(dialogSub);
  }

  approveOrder(order: Order): void {
    const insufficientItem = order.orderItems.find((orderItem: any) => {
      return orderItem.item.quantity < orderItem.requestedQuantity;
    });

    if (insufficientItem) {
      this.snackBar.open(
        `Insufficient quantity for item ${insufficientItem.item.name}. Available: ${insufficientItem.item.quantity}, Requested: ${insufficientItem.requestedQuantity}`,
        'Close',
        { duration: 5000 }
      );
      return;
    }
    order.status = 'APPROVED';
    const approveSub = this.orderService.changeOrderStatus(order).subscribe({
      next: () => {
        this.loadManagerOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to change order status:', err);
      },
    });
    this.subscriptions.add(approveSub);
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

    const declineSub = this.orderService
      .changeOrderStatus(order)
      .subscribe(() => {
        this.loadManagerOrders();
      });
    this.subscriptions.add(declineSub);

    this.declineReasonVisibleId = null;
  }

  goToItems(): void {
    this.router.navigateByUrl('manage-items');
  }
  scheduleDelivery(order: Order): void {
    const dialogRef = this.dialog.open(ScheduleDeliveryComponent, {
      data: order.id,
    });
    const dialogSub = dialogRef.afterClosed().subscribe(() => {
      this.loadManagerOrders()
    });
    this.subscriptions.add(dialogSub);
  }

  goToTrucks() {
    this.router.navigateByUrl('manage-trucks');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
