import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Truck } from 'src/app/models/truck.interface';
import { ScheduleDeliveryService } from 'src/app/services/schedule-delivery.service';
import { TruckService } from 'src/app/services/truck.service';

@Component({
  selector: 'app-schedule-delivery',
  templateUrl: './schedule-delivery.component.html',
  styleUrls: ['./schedule-delivery.component.scss']
})
export class ScheduleDeliveryComponent implements OnInit {
  scheduleForm!: FormGroup;
  availableTrucks: Truck[] = [];

  constructor(
    private fb: FormBuilder,
    private truckService: TruckService,
    private snackBar: MatSnackBar,
    private deliveryService:ScheduleDeliveryService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ScheduleDeliveryComponent>
  ) {
    this.scheduleForm = this.fb.group({
      orderId: [this.data],
      deliveryDate: [null, Validators.required],
      truckIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.scheduleForm.get('deliveryDate')?.valueChanges.subscribe(date => {
      if (date) {
        this.loadAvailableTrucks(date);
      } else {
        this.availableTrucks = [];
      }
    });
  }

  loadAvailableTrucks(deliveryDate: Date): void {
    this.truckService.getAvailableTrucks(deliveryDate).subscribe({
      next: (trucks: Truck[]) => {
        this.availableTrucks = trucks;
      },
      error: (err) => {
        this.snackBar.open('Error loading trucks', 'Close', { duration: 3000 });
      }
    });
  }

  scheduleDelivery(): void {
    if (this.scheduleForm.invalid) {
      this.snackBar.open('Please select a delivery date and at least one truck.', 'Close', { duration: 3000 });
      return;
    }
    const formattedDate =  this.scheduleForm.value.deliveryDate.toISOString().split('T')[0];
    const payload = {
      orderId: this.scheduleForm.value.orderId,
      deliveryDate: formattedDate,
      truckIds: this.scheduleForm.value.truckIds
    };
    this.deliveryService.scheduleDelivery(payload).subscribe((res)=>{

      this.snackBar.open('Delivery scheduled successfully', 'Close', { duration: 3000 });
      this.closeDialog()
    })

  }

  closeDialog() {
    this.dialogRef.close();
  }
}
