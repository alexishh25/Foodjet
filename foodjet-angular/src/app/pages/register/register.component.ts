import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.name.trim() && this.email.trim() && this.password.trim()) {
      this.cartService.register(this.name.trim(), this.email.trim(), this.password.trim()).subscribe({
        next: (user) => {
          alert('¡Registro exitoso! Iniciando sesión...');
          this.cartService.login(this.email.trim(), this.password.trim()).subscribe({
            next: () => {
              this.router.navigate(['/']);
            }
          });
        },
        error: (err) => {
          alert('Error al registrarse: el correo ya se encuentra registrado o los datos son inválidos.');
        }
      });
    }
  }
}
