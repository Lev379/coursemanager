import { computed, inject, Injectable, signal } from '@angular/core';
import { Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@shared/data-access/auth.service';
import { Credentials } from '@shared/types/credentials';

export enum LOGIN_STATUS {
  pending,
  authenticating,
  success,
  error,
}

type LoginState = {
  status: LOGIN_STATUS;
};

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _authService = inject(AuthService);

  // sources
  login$ = new Subject<Credentials>();

  userAuthenticated$ = this.login$.pipe(
    switchMap(credentials => this._authService.login(credentials)),
  );

  // state
  private _state$ = signal<LoginState>({ status: LOGIN_STATUS.pending });

  // selector
  status$ = computed(() => this._state$().status);

  constructor() {
    // reducers
    this.userAuthenticated$.pipe(takeUntilDestroyed()).subscribe({
      next: () => this._state$.update(state => ({ ...state, status: LOGIN_STATUS.success })),
      error: () => this._state$.update(state => ({ ...state, status: LOGIN_STATUS.error })),
    });

    this.login$.pipe(takeUntilDestroyed()).subscribe({
      next: () => this._state$.update(state => ({ ...state, status: LOGIN_STATUS.authenticating })),
      error: () => this._state$.update(state => ({ ...state, status: LOGIN_STATUS.error })),
    })
  }
}
