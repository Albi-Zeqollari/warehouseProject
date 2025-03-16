import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrderDto } from 'src/app/models/Dtos/OrderDto';
import { Order } from 'src/app/models/order.interface';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { MatDialog } from '@angular/material/dialog';
import { EditOrderComponent } from '../edit-order/edit-order.component';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent  implements OnInit,AfterViewInit {
  currentUser!: User;
  orders: any[] = [];
  filteredOrder: OrderDto[] = [];
  filterStatus: string = 'All';
  displayedColumns: string[] = [
    'orderNumber',
    'submittedDate',
    'status',
    'deadlineDate',
    'actions'
  ];
  dataSource = new MatTableDataSource<Order>(this.orders);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private router:Router,
    private orderService:OrderService,
    private authService:AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.loadOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch current user:', err);
      }
    });
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }

loadOrders(): void {
  this.orderService.viewMyOrders(this.currentUser.id).subscribe({
    next: (orders: OrderDto[]) => {
      this.orders = orders;
      console.log(this.orders);

      this.dataSource.data = this.orders
      this.applyClientFilter();
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

   editOrder(order: Order): void {

    this.router.navigateByUrl(`orders/${order.id}`)
    //  const dialogRef = this.dialog.open(EditOrderComponent, {
    //    data: order,
    //  });
    //  dialogRef.afterClosed().subscribe((result) => {});
   }

  cancelOrder(order: Order): void {
    order.status = "CANCELED";
    this.orderService.changeOrderStatus(order).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to change order status:', err);
      }
    });
  }

  changeStatus(order: Order): void {
    order.status = "AWAITING_APPROVAL";
    this.orderService.changeOrderStatus(order).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to change order status:', err);
      }
    });
  }

}
