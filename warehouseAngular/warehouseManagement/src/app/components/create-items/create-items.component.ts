import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Item } from 'src/app/models/item.interface';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-create-items',
  templateUrl: './create-items.component.html',
  styleUrls: ['./create-items.component.scss']
})
export class CreateItemsComponent  implements OnInit{

  createItemForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private itemService:ItemService
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
      this.itemService.createItem(newItem).subscribe(res=>{
        this.goToItems()
      })

    }
  }
  goToItems(){
    this.router.navigateByUrl("manage-items")
  }

  onCancel(): void {
  this.goToItems()
  }
}
