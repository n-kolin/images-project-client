import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIcon,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


  constructor(private dialog: MatDialog,
    private userService: UserService,) { }
  openAddUserForm() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      height: '600px',
      panelClass: 'centered-dialog',
    })
  }

}
