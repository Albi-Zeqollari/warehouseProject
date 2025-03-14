import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {



  constructor(private authService:AuthService,private router:Router){}


  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit(): void {

  }

  onSubmit(): void {

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      console.log('Logging in with', { username, password });
       this.authService.login(username, password).subscribe(response=>{
        if(response){
          this.router.navigateByUrl("/orders")
        }
       })
    } else {
      console.warn('Login form is invalid');
    }
  }
}
