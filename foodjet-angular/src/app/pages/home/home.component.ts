import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent {
  private readonly cartService = inject(CartService);

  readonly products = this.cartService.products;

  getQuantity(productId: number): number {
    return this.cartService.cart()[productId] || 0;
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId);
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }
}
