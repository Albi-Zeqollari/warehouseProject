import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item.interface';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-create-items',
  templateUrl: './create-items.component.html',
  styleUrls: ['./create-items.component.scss'],
})
export class CreateItemsComponent implements OnInit, OnDestroy {
  createItemForm!: FormGroup;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    this.createItemForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.createItemForm.valid) {
      const newItem: Item = this.createItemForm.value;
      const createItemSub = this.itemService
        .createItem(newItem)
        .subscribe(() => {
          this.goToItems();
        });
      this.subscription.add(createItemSub);
    }
  }

  goToItems(): void {
    this.router.navigateByUrl('manage-items');
  }

  onCancel(): void {
    this.goToItems();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
