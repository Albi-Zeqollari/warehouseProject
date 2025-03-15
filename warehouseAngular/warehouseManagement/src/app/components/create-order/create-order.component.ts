import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service'; // Your order service
import { Router } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/models/item.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  orderForm: FormGroup;
  items!: Item[];
  currentUser: any;
  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private itemService: ItemService,
    private authService: AuthService,
    private router:Router,
    private store: Store,
  ) {
    this.orderForm = this.fb.group({
      submittedDate: ['', Validators.required],
      deadlineDate: ['', Validators.required],
      status: ['CREATED'],
      declineReason: [''],
      client: ['', Validators.required],
      orderItems: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addOrderItem();
    this.getItems();
    this.getClient()
  }

  getItems(): void {
    this.itemService.getAllItems().subscribe((res) => {
      this.items = res;
    });
  }

  getClient() {
    this.authService.getCurrentUser().subscribe({
      next: (res: any) => {
        this.currentUser = res;
        this.orderForm.get('client')?.setValue(this.currentUser);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch current user:', err);
      },
    });
  }

  get orderItems(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  addOrderItem(): void {
    const orderItemGroup = this.fb.group({
      selectedItem: [null],
      requestedQuantity: [1, [Validators.required, Validators.min(1)]],
    });
    this.orderItems.push(orderItemGroup);
  }

  removeOrderItem(index: number): void {
    if (this.orderItems.length > 1) {
      this.orderItems.removeAt(index);
    }
  }

  goToOrders(){
    this.router.navigateByUrl("orders")
  }

  submitOrder(): void {
    // Get the raw form value.
    const orderData = this.orderForm.value;

    orderData.orderItems = orderData.orderItems.map((orderItem: any) => {
      const fullItem = this.items.find((dbItem) => dbItem.id === orderItem.selectedItem);
      return {
        item: fullItem,
       requestedQuantity: orderItem.requestedQuantity,
      };
    });
    this.orderService.createOrder(orderData).subscribe(()=>{
      this.goToOrders()
    })
  }

}
