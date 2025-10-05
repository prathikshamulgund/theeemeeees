import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="theme-toggle" (click)="toggleTheme()" [attr.aria-label]="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
      <span *ngIf="!isDarkMode">🌙</span>
      <span *ngIf="isDarkMode">☀️</span>
    </button>
  `,
  styles: [`
    .theme-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px var(--shadow);
      transition: all 0.3s;
      z-index: 1000;
    }

    .theme-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px var(--shadow);
    }
  `]
})
export class ThemeToggleComponent {
  isDarkMode = false;

  constructor(private themeService: ThemeService) {
    this.themeService.darkMode$.subscribe((isDark: boolean)=> {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}