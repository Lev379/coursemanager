import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginModel } from '../models/login.model';
import { User } from '../models/user.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);

  baseUrl = 'https://localhost:7189/api/';

  currentUser = signal<User | null>(null);

  login(model: LoginModel) {
    const { username, password } = model;
    return this._http
      .post<User>(this.baseUrl + 'account/login', {
        username,
        password,
      })
      .pipe(map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
      }));
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
