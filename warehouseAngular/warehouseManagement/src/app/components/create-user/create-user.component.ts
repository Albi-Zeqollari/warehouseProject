import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit, OnDestroy {
  createUserForm!: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  goBack(): void {
    this.router.navigateByUrl('users');
  }

  onSubmit(): void {
    if (this.createUserForm.valid) {
      const newUser = this.createUserForm.value;
      const registerSub = this.authService.register(newUser).subscribe({
        next: (res) => {
          if (res) {
            this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
            this.goBack();
          }
        },
        error: (err) => {
          console.error('User creation failed:', err);
          this.snackBar.open('Failed to create user', 'Close', { duration: 3000 });
        }
      });
      this.subscriptions.add(registerSub);
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
