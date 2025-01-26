import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navigation',
  imports: [MenubarModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  items = [
    {label: 'Wonderful App', icon: 'pi pi-fw pi-home', routerLink: ['/home']},
    {label: 'Matches', icon: 'pi pi-fw pi-user', routerLink: ['/matches']},
    {label: 'Lists', icon: 'pi pi-fw pi-list', routerLink: ['/lisst']},
    {label: 'Messages', icon: 'pi pi-fw pi-inbox', routerLink: ['/messages']}
  ]
}
