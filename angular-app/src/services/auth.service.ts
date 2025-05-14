import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = "http://localhost:5213/api/auth/login";


  constructor(private http: HttpClient) { }


  signIn(user: { email: string, password: string }) {

    return this.http.post(this.authUrl, {
      email: user.email,
      password: user.password
    })
  }
  
}
