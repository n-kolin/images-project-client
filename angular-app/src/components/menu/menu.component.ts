import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignInComponent } from '../sign-in/sign-in.component';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { UserComponent } from "../user/user.component";
import { RegistrationStatsComponent } from '../registration-stats/registration-stats.component';
import { UserService } from '../../services/user.service';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatButton, UserComponent, RegistrationStatsComponent, RouterLink
    , MatIcon, NgClass
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  isLogedIn = false;
  isScrolled = false;

  constructor(private router: Router, private dialog: MatDialog,
    private userService:UserService
  ) { }


  ngOnInit(): void {
    // console.log(sessionStorage.getItem('accessToken'));

console.log('jhj');

    // this.isLogedIn = typeof sessionStorage.getItem('accessToken') === 'string' ? true : false;
  // this.isLogedIn=true
  }
  openSignIn() {
    
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '500px',
      height: 'auto',
      panelClass: 'centered-dialog',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLogedIn = sessionStorage.getItem('accessToken') ? true : false;
      }

    });
  }


  logOut() {
    sessionStorage.removeItem("accessToken");
    this.isLogedIn = false;
    this.router.navigateByUrl('')
    this.userService.clearUsers();
  }
  
  
}
