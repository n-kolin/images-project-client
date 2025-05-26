import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = "https://images-editor-server.onrender.com/api/auth/login";


  constructor(private http: HttpClient) { }


  signIn(user: { email: string, password: string }) {

    return this.http.post(this.authUrl, {
      email: user.email,
      password: user.password
    })
  }


  // בדיקה אם המשתמש מחובר
  isAuth(): boolean {
    return !!sessionStorage.getItem('accessToken');
  }
  
  // קבלת הטוקן
  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }
  
}
