import { Component, ElementRef, model, viewChild, } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { ClickOutsideDirective } from '../../shared/ui/directives/click-outside/click-outside.directive';

@Component({
  selector: 'app-login-dialog',
  imports: [Dialog, Button, ClickOutsideDirective],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login.component.scss',
})
export class LoginDialogComponent {
  backdropEl = viewChild<ElementRef>('backdrop');
  isVisible$ = model(false);

  closeDialog() {
    this.isVisible$.set(false);
  }
}
