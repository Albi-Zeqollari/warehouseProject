import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser: any;
  currentUrl: string = '';

  constructor(private router: Router,private authService:AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        this.authService.getCurrentUser().subscribe({
          next: (res) => {
            this.currentUser = res;
          },
          error: (err: HttpErrorResponse) => {
            console.error('Failed to fetch current user:', err);
          }
        });
      }
    });
  }

    ngOnInit(): void {
    }
    logout(){
      this.authService.logout();
      this.router.navigateByUrl("/login")
    }

    isLoginRoute(): boolean {
      return this.currentUrl.includes('/login');
    }


}
