import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { TruckService } from 'src/app/services/truck.service';

@Component({
  selector: 'app-edit-truck',
  templateUrl: './edit-truck.component.html',
  styleUrls: ['./edit-truck.component.scss']
})
export class EditTruckComponent {
 editTruckForm!: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private truckService: TruckService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.editTruckForm = this.fb.group({
      licensePlate: [this.data.truck.licensePlate, Validators.required],
      chassisNumber: [this.data.truck.chassisNumber, Validators.required],
    });
  }

  onSave(): void {
    if (this.editTruckForm.valid) {
      const updatedTruck = { ...this.data, ...this.editTruckForm.value };
      const truckToUpdate={
        id:updatedTruck.truck.id,
        licensePlate:updatedTruck.licensePlate,
        chassisNumber:updatedTruck.chassisNumber
      }
      const updateSub = this.truckService.updateTruck(truckToUpdate).subscribe({
        next: () => {
          this.snackBar.open('Truck updated successfully!', 'Close', { duration: 3000 });
          this.onCancel();
        },
        error: (err) => {
          console.error('Error updating truck:', err);
          this.snackBar.open('Cant update truck who is assigned for delivery', 'Close', { duration: 3000 });
        }
      });
      this.subscriptions.add(updateSub);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
