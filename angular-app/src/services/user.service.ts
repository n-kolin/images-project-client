import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { MonthlyStats } from '../models/monthly-stats';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = "https://images-editor-server.onrender.com/api/user"
  private authUrl = "https://images-editor-server.onrender.com/api/auth/register"

  private UsersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public users$ = this.UsersSubject.asObservable();

  constructor(private http: HttpClient, private errorService:ErrorService) { }

  getAllUsers() {

    this.http.get<User[]>(this.baseUrl).subscribe(data => {
      this.UsersSubject.next(data);
    }, (e) => {
        
      this.errorService.handleHttpError(e);
      console.log(e);
    }
  );

  }
  // getUserById(id: number): Observable<User> {
  //   return this.http.get<User>(`${this.baseUrl}/${id}`);
  // }
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/email/${email}`);
  }

  deleteUser(id: number) {
    this.http.delete(`${this.baseUrl}/${id}`).subscribe(() => {
      this.getAllUsers();
    })
  }

  addUser(user: Omit<User, "id"|"createdAt">) {

    console.log(user);
    return this.http.post(this.authUrl,user).subscribe(() => {
      this.getAllUsers();
    })
    
  }


  getRegistrationStats(): Observable<MonthlyStats[]> {
    // debugger
    return this.http.get<MonthlyStats[]>(`${this.baseUrl}/registration-stats`); 
  }


  emptyUsers() {

    this.UsersSubject.next([]);

  }


   // פונקציה חדשה לריקון המערך
   clearUsers() {
    this.UsersSubject.next([]);
  }


}
