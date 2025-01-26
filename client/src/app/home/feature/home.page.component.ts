import { Component } from '@angular/core';
import { NavigationComponent } from '../ui/navigation/navigation.component';

@Component({
  selector: 'app-home',
  imports: [NavigationComponent],
  templateUrl: './home.page.component.html',
  styleUrl: './home.page.component.scss',
})
export class HomePageComponent {}
