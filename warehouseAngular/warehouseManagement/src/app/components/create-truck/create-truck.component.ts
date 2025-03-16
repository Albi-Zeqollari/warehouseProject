import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item.interface';
import { Truck } from 'src/app/models/truck.interface';
import { ItemService } from 'src/app/services/item.service';
import { TruckService } from 'src/app/services/truck.service';

@Component({
  selector: 'app-create-truck',
  templateUrl: './create-truck.component.html',
  styleUrls: ['./create-truck.component.scss']
})
export class CreateTruckComponent {
  createTruckForm!: FormGroup;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private truckService: TruckService
  ) {}

  ngOnInit(): void {
    this.createTruckForm = this.fb.group({
      licensePlate: ['', Validators.required],
      chassisNumber: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.createTruckForm.valid) {
      const newTruck: Truck = this.createTruckForm.value;
      const createItemSub = this.truckService
        .createTruck(newTruck)
        .subscribe(() => {
          this.goToTrucks();
        });
      this.subscription.add(createItemSub);
    }
  }

  goToTrucks(): void {
    this.router.navigateByUrl('manage-trucks');
  }

  onCancel(): void {
    this.goToTrucks();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
