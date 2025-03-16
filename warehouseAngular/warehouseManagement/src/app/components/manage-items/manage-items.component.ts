import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Item } from 'src/app/models/item.interface';
import { ItemService } from 'src/app/services/item.service';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-items',
  templateUrl: './manage-items.component.html',
  styleUrls: ['./manage-items.component.scss'],
})
export class ManageItemsComponent implements OnInit ,AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'quantity',
    'unitPrice',
    'actions',
  ];

  dataSource = new MatTableDataSource<Item>();

 @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private itemService: ItemService,private router:Router,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadItems();
  }
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }
  loadItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (items: Item[]) => {

        this.dataSource.data = items;
      },
      error: (err: any) => {
        console.error('Error loading items:', err);
      },
    });
  }

  createItem() {
    this.router.navigateByUrl("create-items")
  }
  goToWarehouse(){
    this.router.navigateByUrl("warehouse")
  }
  editItem(item: any) {
    const dialogRef = this.dialog.open(EditItemComponent, {
      data: { item }
    });

    dialogRef.afterClosed().subscribe((updatedItem: Item) => {
        this.loadItems()
    });
  }
  deleteItem(item: any) {
  this.itemService.deleteItem(item.id).subscribe(()=>{
    this.loadItems()
  })
  }
}
