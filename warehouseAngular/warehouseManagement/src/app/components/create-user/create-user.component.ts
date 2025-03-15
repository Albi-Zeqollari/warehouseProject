import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  createUserForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  goBack(){
    this.router.navigateByUrl('users');
  }

  onSubmit(): void {
    if (this.createUserForm.valid) {
      const newUser = this.createUserForm.value;

      this.authService.register(newUser).subscribe((res) => {
        if (res) {
          this.goBack()
        }
      });
    }
  }
}
