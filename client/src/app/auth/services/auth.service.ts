import { computed, inject, Injectable, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { map } from 'rxjs';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private readonly _http = inject(HttpClient);

  baseUrl = 'https://localhost:7189/api/';

  currentUser$ = signal<User | null>(null);

  isLoggedIn$ = computed(() => {
    const userString = this._getFromLocalStorage('user');
    console.log(userString)
    if (!userString) {
      return false;
    }
    const user = JSON.parse(userString);
    return this.currentUser$()?.token === user.token;
  })

  setCurrentUser() {
    const userString = this._getFromLocalStorage('user');
    if (!userString) {
      return;
    }
    const user = JSON.parse(userString);
    this.currentUser$.set(user);
  };

  login(model: LoginModel) {
    const { username, password } = model;
    return this._http
      .post<User>(this.baseUrl + 'account/login', {
        username,
        password,
      })
      .pipe(
        map(user => {
          if (user) {
            this._setInLocalStorage('user', JSON.stringify(user));
            this.currentUser$.set(user);
          }
        }),
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser$.set(null);
  }

  private _getFromLocalStorage(key: string) {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key) ?? null;
  }

  private _setInLocalStorage(key: string, value: string) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, value);
  }

  ngOnInit() {}
}
