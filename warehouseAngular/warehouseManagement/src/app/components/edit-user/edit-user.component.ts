import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit, OnDestroy {
  editUserForm!: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.editUserForm = this.fb.group({
      username: [this.data.username, Validators.required],
      role: [this.data.role, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      const updatedUser: User = {
        ...this.data,
        ...this.editUserForm.value,
      };
      const toUpdateUser = {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
      };

      const updateSub = this.authService.updateUser(toUpdateUser).subscribe({
        next: (res) => {
          if (res) {
            this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
            this.onCancel();
          }
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.snackBar.open('Error updating user', 'Close', { duration: 3000 });
        }
      });
      this.subscriptions.add(updateSub);
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
