import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  editUserForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService:AuthService

  ) { }

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
        id:updatedUser.id,
        username:updatedUser.username,
        role:updatedUser.role
      }
      this.authService.updateUser(toUpdateUser).subscribe({
        next: (res) => {
          if(res)
         this.onCancel()
        },
        error: (err) => {
          console.error('Error updating user:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
