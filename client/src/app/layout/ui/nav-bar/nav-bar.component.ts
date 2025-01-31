import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { LoginDialogComponent } from '../../login/login-dialog.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [MenubarModule, Button, LoginDialogComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavBarComponent implements OnInit {
  private readonly _authService = inject(AuthService);

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

  ngOnInit() {
    this._authService.setCurrentUser();
  }
}
