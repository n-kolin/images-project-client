import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignInComponent } from '../sign-in/sign-in.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-unauth',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './unauth.component.html',
  styleUrl: './unauth.component.css'
})
export class UnauthComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  openLoginForm(): void {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '500px',
      height: 'auto',
      disableClose: false,
      panelClass: 'login-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User successfully logged in, you can redirect them to the original page they tried to access
        // This would require storing the intended URL somewhere, like in a service or localStorage
        // For now, we'll just navigate to the home page
        this.router.navigate(['/']);
      }
    });
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }
}