import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  currentUser: any;

  constructor(private authService:AuthService,private router:Router){}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
           next: (res) => {
             this.currentUser = res;
           },
           error: (err: HttpErrorResponse) => {
             console.error('Failed to fetch current user:', err);
           }
         });
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
