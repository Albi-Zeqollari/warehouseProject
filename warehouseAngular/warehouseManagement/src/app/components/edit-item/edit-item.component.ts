import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/models/item.interface';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit{

  editItemForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Item } ,
    private itemService:ItemService// The passed-in item
  ) {}

  ngOnInit(): void {
    // Initialize the form with the item's existing data
    this.editItemForm = this.fb.group({
      name: [this.data.item.name, Validators.required],
      quantity: [this.data.item.quantity, [Validators.required, Validators.min(1)]],
      unitPrice: [this.data.item.unitPrice, [Validators.required, Validators.min(0)]]
    });
  }

  onSave(): void {
    if (this.editItemForm.valid) {
      // Merge the updated form values with the original item (to retain id, etc.)
      const updatedItem: Item = { ...this.data.item, ...this.editItemForm.value };

      // Call your service to update the item
      // this.itemService.updateItem(updatedItem).subscribe({
      //   next: (result: Item) => {
      //     // Close the dialog, returning the updated item
      //     this.dialogRef.close(result);
      //   },
      //   error: (err: any) => {
      //     console.error('Error updating item:', err);
      //   }
      // });
    }
  }

  onCancel(): void {
    // Simply close the dialog without saving
    this.dialogRef.close();
  }

}
