import { OrderItem } from './../../models/orderItem.inteface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/models/item.interface';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit {
  editOrderForm!: FormGroup;
  availableItems: Item[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    this.loadAvailableItems();

    this.editOrderForm = this.fb.group({
      orderNumber: [{ value: '', disabled: true }],
      id: [],
      orderItems: this.fb.array([], Validators.required)
    });

    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (orderId && !isNaN(orderId)) {
      this.orderService.findOrderById(orderId).subscribe(order => {
        this.populateForm(order);
      });
    }
  }

  loadAvailableItems() {
    this.itemService.getAllItems().subscribe(items => {
      this.availableItems = items;
    });
  }

  populateForm(order: any): void {
    this.editOrderForm.patchValue({
      orderNumber: order.orderNumber,
      id: order.id,
    });

    order.orderItems.forEach((orderItem: any) => {
      this.orderItems.push(this.createOrderItemGroup(orderItem.item, orderItem.requestedQuantity));
    });
  }

  createOrderItemGroup(item?: Item, requestedQuantity: number = 1): FormGroup {
    return this.fb.group({
      item: [item || null, Validators.required],
      requestedQuantity: [requestedQuantity, [Validators.required, Validators.min(1)]],
    });
  }

  addItem(): void {
    this.orderItems.push(this.createOrderItemGroup());
  }

  onItemSelected(itemName: string, index: number): void {
    const selectedItem = this.availableItems.find(item => item.name === itemName);
    if (selectedItem) {
      this.orderItems.at(index).patchValue({
        item: selectedItem,
      });
    }
  }

  get orderItems(): FormArray {
    return this.editOrderForm.get('orderItems') as FormArray;
  }

  removeItem(index: number): void {
    if (this.orderItems.length > 1) {
      this.orderItems.removeAt(index);
    } else {
      alert('Order must have at least one item.');
    }
  }

  submit(): void {
    if (this.editOrderForm.valid && this.orderItems.length > 0) {
      const orderData = this.editOrderForm.getRawValue();

      const orderItemsPayload = orderData.orderItems.map((item: any) => ({
        item: { id: item.item.id },
        requestedQuantity: item.requestedQuantity,
        order: { id: orderData.id }
      }));

      console.log(orderItemsPayload);


      this.orderService.updateOrderItems(orderData.id,orderItemsPayload).subscribe(() => {
        alert('Order updated successfully.');
        this.router.navigate(['/orders']);
      });
    } else {
      alert('Please correct the form. Order items cannot be empty.');
    }
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }
}
