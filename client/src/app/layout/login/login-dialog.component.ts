import { Component, inject, model } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { ClickOutsideDirective } from '../../shared/ui/directives/click-outside/click-outside.directive';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { LoginModel } from '../../auth/models/Login.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-dialog',
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
  private readonly _authService = inject(AuthService);

  isVisible$ = model(false);

  model = new LoginModel('', '');

  closeDialog() {
    this.isVisible$.set(false);
  }

  onSubmit() {
    this._authService.login(this.model).subscribe({
      next: res => {
        console.log(res);
        this.model.clearInput();
        this.closeDialog();
      },
      error: () => console.log('error'),
    });
  }
}
