import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { TruckService } from 'src/app/services/truck.service';
import { EditTruckComponent } from '../edit-truck/edit-truck.component';

@Component({
  selector: 'app-manage-trucks',
  templateUrl: './manage-trucks.component.html',
  styleUrls: ['./manage-trucks.component.scss']
})
export class ManageTrucksComponent {
  displayedColumns: string[] = [
    'id',
    'license plate',
    'chassis number',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private truckService: TruckService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTrucks();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTrucks(): void {
    const loadSub = this.truckService.getAllTrucks().subscribe({
      next: (trucks: any[]) => {
        this.dataSource.data = trucks;
      },
      error: (err: any) => {
        console.error('Error loading trucks:', err);
        this.snackBar.open('Error loading trucks', 'Close', { duration: 3000 });
      },
    });
    this.subscriptions.add(loadSub);
  }

  createTruck(): void {
    this.router.navigateByUrl('create-trucks');
  }

  goToWarehouse(): void {
    this.router.navigateByUrl('warehouse');
  }

  editTruck(truck: any): void {
    const dialogRef = this.dialog.open(EditTruckComponent, {
      data: { truck }
    });

    const afterClosedSub = dialogRef.afterClosed().subscribe(() => {
      this.loadTrucks();
    });
    this.subscriptions.add(afterClosedSub);
  }

  deleteTruck(item: any): void {
    const deleteSub = this.truckService.delteTruck(item.id).subscribe({
      next: () => {
        this.snackBar.open('Item deleted successfully', 'Close', { duration: 3000 });
        this.loadTrucks();
      },
      error: (err: any) => {
        console.error('Error deleting item:', err);
        this.snackBar.open('Error deleting item', 'Close', { duration: 3000 });
      }
    });
    this.subscriptions.add(deleteSub);
  }
}
