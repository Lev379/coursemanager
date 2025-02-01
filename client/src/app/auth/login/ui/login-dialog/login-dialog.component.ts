import { Component, inject, input, model, output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '@shared/ui/directives/click-outside/click-outside.directive';
import { LOGIN_STATUS, LoginService } from '@auth/login/data-access/login.service';
import { Credentials } from '@shared/types/credentials';
import { CredentialsModel } from '@auth/login/models/credentials.model';

@Component({
  selector: 'auth-login-dialog',
  imports: [
    Dialog,
    Button,
    ClickOutsideDirective,
    InputText,
    FormsModule,
  ],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login.component.scss',
})
export class LoginDialogComponent {
  private _loginService = inject(LoginService);

  model: CredentialsModel = new CredentialsModel('', '');

  isVisible$ = model(false);

  closeDialog() {
    this.isVisible$.set(false);
    this.model.clear();
  }

  onSubmit() {
    console.log(this.model.credentials)
    this._loginService.login$.next(this.model.credentials);
    this.closeDialog();
  }
}
