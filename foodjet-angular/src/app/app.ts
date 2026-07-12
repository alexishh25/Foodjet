import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly router = inject(Router);
  readonly cartService = inject(CartService);

  navigateToSection(sectionId: string, event: Event) {
    event.preventDefault();
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
    }
  }

  openCart() {
    if (typeof bootstrap !== 'undefined' && bootstrap.Offcanvas) {
      const element = document.getElementById('cartOffcanvas');
      if (element) {
        const offcanvas = new bootstrap.Offcanvas(element);
        offcanvas.show();
      }
    } else {
      console.warn('Bootstrap is not loaded globally.');
    }
  }

  removeItemCompletely(productId: number) {
    this.cartService.removeItemCompletely(productId);
  }

  goToCheckout() {
    const element = document.getElementById('cartOffcanvas');
    if (element && typeof bootstrap !== 'undefined') {
      const offcanvas = bootstrap.Offcanvas.getInstance(element);
      if (offcanvas) {
        offcanvas.hide();
      }
    }
    this.router.navigate(['/checkout']);
  }

  logout() {
    this.cartService.logout();
    this.router.navigate(['/']);
  }
}
