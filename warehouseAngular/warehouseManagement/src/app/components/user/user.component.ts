  import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
  import { MatPaginator } from '@angular/material/paginator';
  import { MatTableDataSource } from '@angular/material/table';
  import { AuthService } from 'src/app/services/auth.service';
  import { EditUserComponent } from '../edit-user/edit-user.component';
  import { Router } from '@angular/router';
import { User } from 'src/app/models/user.interface';

  @Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
  })
  export class UserComponent implements OnInit,AfterViewInit {
    users!:any;
    constructor(private authService: AuthService,private router:Router) {}
    readonly dialog = inject(MatDialog);
    dataSource = new MatTableDataSource<User>(this.users);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    displayedColumns: string[] = ['id', 'name', 'role', 'actions'];

    ngOnInit(): void {
      this.getAllUsers();
    }

    ngAfterViewInit(){
      this.dataSource.paginator = this.paginator;
    }
    editUser(user: any): void {
      const dialogRef = this.dialog.open(EditUserComponent, {
        data: user,
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.getAllUsers();
      });
    }

    getAllUsers() {
      this.authService.getAllUsers().subscribe((response) => {
        this.users = response;
        this.dataSource.data = this.users
      });
    }

    createUser(){
      this.router.navigateByUrl("/create-users")
    }

    deleteUser(userId: number): void {
      this.authService.deleteUser(userId).subscribe(()=>{
          this.getAllUsers()
      })
    }
  }
