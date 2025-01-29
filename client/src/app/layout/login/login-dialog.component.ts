import { Component, ElementRef, model, viewChild } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { ClickOutsideDirective } from '../../shared/ui/directives/click-outside/click-outside.directive';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-dialog',
  imports: [Dialog, Button, ClickOutsideDirective, InputText, FormsModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login.component.scss',
})
export class LoginDialogComponent {
  isVisible$ = model(false);

  model = new LoginDto('', '');

  closeDialog() {
    this.isVisible$.set(false);
  }

  onSubmit() {
    const { username, password } = this.model;
    console.log(username, password);
    this.model.clearInput();
  }
}

export class LoginDto {
  constructor(
    public username: string,
    public password: string,
  ) {}

  clearInput() {
    this.username = '';
    this.password = '';
  }
}
