import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userSub = this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.currentUser = res;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch current user:', err);
        this.snackBar.open('Failed to fetch current user', 'Close', { duration: 3000 });
      }
    });
    this.subscriptions.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goToAdminDashboard(): void {
    this.router.navigateByUrl('/users');
  }

  goToWarehouseDashboard(): void {
    this.router.navigateByUrl('/warehouse');
  }

  goToClientDashboard(): void {
    this.router.navigateByUrl('/orders');
  }
}
