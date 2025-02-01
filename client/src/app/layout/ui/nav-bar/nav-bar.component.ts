import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { LoginDialogComponent } from '@auth/login/ui/login-dialog/login-dialog.component';
import { AuthService } from '@shared/data-access/auth.service';

@Component({
  selector: 'layout-nav-bar',
  imports: [MenubarModule, Button, LoginDialogComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent {
  private _authService = inject(AuthService);

  items = [
    { label: 'Wonderful App', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
    { label: 'Matches', icon: 'pi pi-fw pi-user', routerLink: ['/matches'] },
    { label: 'Lists', icon: 'pi pi-fw pi-list', routerLink: ['/list'] },
    { label: 'Messages', icon: 'pi pi-fw pi-inbox', routerLink: ['/messages'] },
  ];

  isLoginDialogOpen$ = signal(false);

  get isLoggedIn$() {
    return this._authService.isLoggedIn$;
  }

  showLoginDialog() {
    this.isLoginDialogOpen$.set(true);
  }

  logout() {
    this._authService.logout();
  }
}
