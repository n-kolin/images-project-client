import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    MatIconModule,
    NgClass,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;

  hidePassword = true // Controls password visibility
  emailFocused = false // Tracks if email field is focused
  passwordFocused = false // Tracks if password field is focused

  constructor(private fb: FormBuilder, private authService: AuthService,
    private dialogRef: MatDialogRef<SignInComponent>,
    private errorService:ErrorService
  ) { }

  ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  login() {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).subscribe((data:any) => {
        sessionStorage.setItem("accessToken", data.token);
        this.dialogRef.close(true);

      }, (e) => {
        
        this.errorService.handleHttpError(e);

        // this.dialogRef.close(false);
        console.log(e);
        console.log(this.loginForm.value);  
      }
      );
    }
  }

  closeDialog() {
    this.dialogRef.close(true);
    console.log('close');
    

  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword
  }

}
