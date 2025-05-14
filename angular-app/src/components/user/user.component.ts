import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { MatCardActions, MatCardHeader, MatCardTitle, MatCard, MatCardContent } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule,
    MatCardActions, MatCardHeader, MatCardTitle, MatCard, MatCardContent,
    MatButtonModule,
    MatIcon,DatePipe
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  users: User[] = []
  filteredUsers: User[] = []
  searchText: string = '';

  constructor(private dialog: MatDialog,
    private userService: UserService,
  ) { }

  ngOnInit(): void {

    console.log('gh');

    this.userService.users$.subscribe((data) => {
      this.users = data
      this.filteredUsers = data;
    });
    this.userService.getAllUsers()
    // console.log(this.users);

  }
  f() {
    this.userService.getAllUsers()
  }

  
  filterUsers(): void {
    const search = this.searchText.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.email.toLowerCase().includes(search)
    );
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id);
  }

  // getUserByEmail(email: string) {
  //   this.userService.getUserByEmail(email).subscribe((data) => {
  //     console.log(data);
  //   })
  // }


  openUserForm() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      height: 'auto',
      panelClass: 'centered-dialog',
    })
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.getId().then(() => {
    //       console.log(this.id, this.user);

    //     })
    //   }

    // });
  }


}
