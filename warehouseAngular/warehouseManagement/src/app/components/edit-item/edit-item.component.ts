import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item.interface';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit, OnDestroy {
  editItemForm!: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private itemService: ItemService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.editItemForm = this.fb.group({
      name: [this.data.item.name, Validators.required],
      quantity: [this.data.item.quantity, [Validators.required, Validators.min(1)]],
      unitPrice: [this.data.item.unitPrice, [Validators.required, Validators.min(0)]]
    });
  }

  onSave(): void {
    if (this.editItemForm.valid) {
      const updatedItem: Item = { ...this.data.item, ...this.editItemForm.value };
      const updateSub = this.itemService.updateItem(updatedItem).subscribe({
        next: () => {
          this.snackBar.open('Item updated successfully!', 'Close', { duration: 3000 });
          this.onCancel();
        },
        error: (err) => {
          console.error('Error updating item:', err);
          this.snackBar.open('Failed to update item', 'Close', { duration: 3000 });
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
