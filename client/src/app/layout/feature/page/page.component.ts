import { Component } from '@angular/core';
import { NavBarComponent } from '@layout/ui/nav-bar/nav-bar.component';

@Component({
  selector: 'app-home',
  imports: [NavBarComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent {}
