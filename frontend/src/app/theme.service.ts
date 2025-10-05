import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  darkMode$: Observable<boolean> = this.darkMode.asObservable();

  constructor() {
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.enableDarkMode();
    } else {
      this.enableLightMode();
    }
  }

  toggleTheme(): void {
    if (this.darkMode.value) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode(): void {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    this.darkMode.next(true);
  }

  enableLightMode(): void {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    this.darkMode.next(false);
  }

  isDarkMode(): boolean {
    return this.darkMode.value;
  }
}