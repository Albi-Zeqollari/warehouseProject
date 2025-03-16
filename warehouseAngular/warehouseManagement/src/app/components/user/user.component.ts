import { AfterViewInit, Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy {
  users!: any;
  dataSource = new MatTableDataSource<User>(this.users);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id', 'name', 'role', 'actions'];
  private subscriptions: Subscription = new Subscription();
  readonly dialog = inject(MatDialog);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      data: user,
    });

    const dialogSub = dialogRef.afterClosed().subscribe(() => {
      this.getAllUsers();
    });
    this.subscriptions.add(dialogSub);
  }

  getAllUsers(): void {
    const getUsersSub = this.authService.getAllUsers().subscribe((response) => {
      this.users = response;
      this.dataSource.data = this.users;
    });
    this.subscriptions.add(getUsersSub);
  }

  createUser(): void {
    this.router.navigateByUrl("/create-users");
  }

  deleteUser(userId: number): void {
    const deleteUserSub = this.authService.deleteUser(userId).subscribe(() => {
      this.getAllUsers();
    });
    this.subscriptions.add(deleteUserSub);
  }
}
