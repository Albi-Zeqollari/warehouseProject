import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Item } from 'src/app/models/item.interface';
import { ItemService } from 'src/app/services/item.service';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-items',
  templateUrl: './manage-items.component.html',
  styleUrls: ['./manage-items.component.scss'],
})
export class ManageItemsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'name',
    'quantity',
    'unitPrice',
    'actions',
  ];

  dataSource = new MatTableDataSource<Item>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private itemService: ItemService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadItems(): void {
    const loadSub = this.itemService.getAllItems().subscribe({
      next: (items: Item[]) => {
        this.dataSource.data = items;
      },
      error: (err: any) => {
        console.error('Error loading items:', err);
        this.snackBar.open('Error loading items', 'Close', { duration: 3000 });
      },
    });
    this.subscriptions.add(loadSub);
  }

  createItem(): void {
    this.router.navigateByUrl('create-items');
  }

  goToWarehouse(): void {
    this.router.navigateByUrl('warehouse');
  }

  editItem(item: any): void {
    const dialogRef = this.dialog.open(EditItemComponent, {
      data: { item }
    });

    const afterClosedSub = dialogRef.afterClosed().subscribe(() => {
      this.loadItems();
    });
    this.subscriptions.add(afterClosedSub);
  }

  deleteItem(item: any): void {
    const deleteSub = this.itemService.deleteItem(item.id).subscribe({
      next: () => {
        this.snackBar.open('Item deleted successfully', 'Close', { duration: 3000 });
        this.loadItems();
      },
      error: (err: any) => {
        console.error('Error deleting item:', err);
        this.snackBar.open('Error deleting item', 'Close', { duration: 3000 });
      }
    });
    this.subscriptions.add(deleteSub);
  }
}
