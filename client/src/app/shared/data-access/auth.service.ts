import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { User } from '@shared/types/user';
import { Credentials } from '@shared/types/credentials';

export type AuthState = {
  user: User | null;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = 'https://localhost:7189/api/';

  // state
  private _state$ = signal<AuthState>({ user: null });

  // selectors
  user$ = computed(() => this._state$().user);
  isLoggedIn$ = computed(() => this._state$().user !== null);

  constructor() {
    this._setCurrentUserFromStorage();
  }

  private _setCurrentUserFromStorage() {
    const userString = this._getFromLocalStorage('user');
    if (userString) {
      const user = JSON.parse(userString) as User;
      this._state$.update(state => ({ ...state, user }));
    }
  }

  login(credentials: Credentials) {
    const { username, password } = credentials;
    return this._http
      .post<User>(this._baseUrl + 'account/login', {
        username,
        password,
      })
      .pipe(
        map(user => {
          if (user) {
            this._setInLocalStorage('user', JSON.stringify(user));
            this._state$.update(() => ({ user }));
          }
        }),
      );
  }

  logout() {
    this._removeFromLocalStorage('user');
    this._state$.update(() => ({ user: null }));
  }

  private _getFromLocalStorage(key: string) {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key) ?? null;
  }

  private _setInLocalStorage(key: string, value: string) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, value);
  }

  private _removeFromLocalStorage(key: string) {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  }
}
