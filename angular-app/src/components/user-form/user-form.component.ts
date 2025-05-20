import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-form',
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
    
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  registerForm: FormGroup;

  hidePassword = true // Controls password visibility
  emailFocused = false // Tracks if email field is focused
  passwordFocused = false // Tracks if password field is focused

  constructor(private fb: FormBuilder, private userService: UserService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private dialogRef: MatDialogRef<UserFormComponent>
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['User', Validators.required]
    });
  }

  addUser() {
    if (this.registerForm.valid) {
      this.userService.addUser(this.registerForm.value)
      this.dialogRef.close(true);
    }
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

}
