import { Routes } from '@angular/router';
import { PageComponent } from '@layout/feature/page/page.component';

export const routes: Routes = [
  {path: 'home', component: PageComponent},
  {path: '**', component: PageComponent},
];
