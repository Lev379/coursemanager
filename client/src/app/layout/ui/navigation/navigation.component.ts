import { Component, signal } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { LoginDialogComponent } from '../../login/login-dialog.component';

@Component({
  selector: 'app-navigation',
  imports: [MenubarModule, Button, LoginDialogComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  items = [
    { label: 'Wonderful App', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
    { label: 'Matches', icon: 'pi pi-fw pi-user', routerLink: ['/matches'] },
    { label: 'Lists', icon: 'pi pi-fw pi-list', routerLink: ['/list'] },
    { label: 'Messages', icon: 'pi pi-fw pi-inbox', routerLink: ['/messages'] },
  ];

  isLoginDialogOpen$ = signal(false);

  showLoginDialog() {
    this.isLoginDialogOpen$.set(true);
  }
}
