import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  full_name = '';
  email = '';
  password = '';
  confirmPassword = '';
  region = '';
  organization = '';
  message = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSignup(): void {
    if (!this.full_name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All required fields must be filled';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.signup(this.full_name, this.email, this.password, this.region, this.organization).subscribe({
      next: () => {
        this.message = 'Signup successful! Please login.';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Signup failed';
      }
    });
  }
}
