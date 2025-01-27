import { Component, model, } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-login-dialog',
  imports: [Dialog, Button],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login.component.scss',
})
export class LoginDialogComponent {
  isVisible$ = model(false);

  closeDialog() {
    this.isVisible$.set(false);
  }
}
