import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const loginSub = this.authService.login(username, password).subscribe({
        next: () => {
          this.snackBar.open('Logged in successfully', 'Close', { duration: 3000 });
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          this.snackBar.open('Username or password incorrect', 'Close', { duration: 3000 });
          console.error('Login failed:', err);
        }
      });
      this.subscriptions.add(loginSub);
    } else {
      this.snackBar.open('Please fill out both username and password', 'Close', { duration: 3000 });
      console.warn('Login form is invalid');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
