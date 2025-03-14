import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Order } from 'src/app/models/order.interface';
import { OrderStatus } from 'src/app/models/orderStatus.enum';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

  orderForm!: FormGroup;

  constructor(private fb: FormBuilder,private orderService:OrderService) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      deadlineDate: [null, Validators.required],
      orderItems: this.fb.array([])
    });

    // Optionally, initialize with one empty order item.
    this.addItem();
  }

  get orderItems(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  addItem(): void {
    const itemForm = this.fb.group({
      itemName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.orderItems.push(itemForm);
  }

  removeItem(index: number): void {
    this.orderItems.removeAt(index);
  }

  order: Order = {
    deadlineDate: new Date().toISOString(),
    client: JSON.parse(localStorage.getItem("user")!),
    orderItems: [
      {
        item: {
          name: 'hekur',
          quantity: 0,
          unitPrice: 5,
          id: '1'
        },
        requestedQuantity: 5,
        id: 0,
        order: {
          id: 0,
          orderNumber: '214',
          submittedDate: '',
          status: 'Created',
          deadlineDate: '',
          client: JSON.parse(localStorage.getItem("user")!),
          orderItems: []
        }
      }
    ],
    submittedDate: new Date().toISOString(),
    status: OrderStatus.CREATED,
    declineReason: '',
    id: 1,
    orderNumber: ''
  };

  onSubmit(): void {
    if (this.orderForm.valid) {

      console.log(this.order);

      this.orderService.createOrder(this.order).subscribe(data=>{
        console.log(data);

      })


    } else {
      console.warn('Order form is invalid');
    }
  }

  cancel(): void {
    // Reset form or navigate away.
    this.orderForm.reset();
  }
}
