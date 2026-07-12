import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.email.trim() && this.password.trim()) {
      this.cartService.login(this.email.trim(), this.password.trim()).subscribe({
        next: (user) => {
          if (user.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          alert('Error de inicio de sesión: el correo o la contraseña no coinciden con nuestros registros.');
        }
      });
    }
  }

  quickLogin() {
    this.cartService.quickDemoLogin();
    this.router.navigate(['/']);
  }
}
