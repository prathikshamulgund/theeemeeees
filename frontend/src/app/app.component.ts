import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ThemeToggleComponent],
  template: `
    <app-theme-toggle></app-theme-toggle>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}