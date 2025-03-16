import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit, OnDestroy {
  viewOrderForm!: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ViewOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.viewOrderForm = this.fb.group({
      orderNumber: [{ value: '', disabled: true }],
      submittedDate: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }],
      deadlineDate: [{ value: '', disabled: true }],
      declineReason: [{ value: '', disabled: true }],
      clientUsername: [{ value: '', disabled: true }],
      orderItems: this.fb.array([])
    });

    if (this.data) {
      this.populateForm(this.data);
    }
  }

  get orderItems(): FormArray {
    return this.viewOrderForm.get('orderItems') as FormArray;
  }

  populateForm(order: any): void {
    this.viewOrderForm.patchValue({
      orderNumber: order.orderNumber,
      submittedDate: order.submittedDate,
      status: order.status,
      deadlineDate: order.deadlineDate,
      declineReason: order.declineReason,
      clientUsername: order.client?.username
    });
    this.orderItems.clear();
    if (order.orderItems && Array.isArray(order.orderItems)) {
      order.orderItems.forEach((item: any) => {
        this.orderItems.push(
          this.fb.group({
            itemName: [{ value: item.item?.name, disabled: true }],
            availableQuantity: [{ value: item.item?.quantity, disabled: true }],
            unitPrice: [{ value: item.item?.unitPrice, disabled: true }],
            requestedQuantity: [{ value: item.requestedQuantity, disabled: true }]
          })
        );
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
