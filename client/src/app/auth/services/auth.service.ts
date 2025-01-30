import { inject, Injectable, model } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginModel } from '../models/Login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  baseUrl = 'https://localhost:7189/api/';

  login(model: LoginModel) {
    const { username, password } = model;
    return this._http.post(this.baseUrl + 'account/login', {
      username,
      password,
    });
  }
}
