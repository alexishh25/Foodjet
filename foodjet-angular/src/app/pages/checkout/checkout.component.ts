import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: []
})
export class CheckoutComponent {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  readonly cartItems = this.cartService.cartItems;
  readonly cartSubtotal = this.cartService.cartSubtotal;
  readonly cartTotal = this.cartService.cartTotal;
  readonly deliveryFee = this.cartService.deliveryFee;

  customerName = this.cartService.currentUser()?.name || '';
  customerPhone = '';
  customerAddress = '';
  customerReference = '';

  paymentMethod = 'cash';

  cardNumber = '';
  cardExpiry = '';
  cardCvc = '';

  onSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.customerName.trim() || !this.customerPhone.trim() || !this.customerAddress.trim()) {
      alert('Por favor, completa los campos requeridos (Nombre, Teléfono y Dirección).');
      return;
    }

    const backendItems = this.cartItems().map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

    const orderData = {
      customerName: this.customerName.trim(),
      customerPhone: this.customerPhone.trim(),
      customerAddress: this.customerAddress.trim(),
      customerReference: this.customerReference.trim(),
      paymentMethod: this.paymentMethod,
      totalPrice: this.cartTotal(),
      items: backendItems
    };

    this.cartService.createOrder(orderData).subscribe({
      next: (createdOrder) => {
        this.cartService.lastOrderPaymentMethod.set(this.paymentMethod);
        
        this.cartService.clearCart();
        
        this.router.navigate(['/tracking']);
      },
      error: (err) => {
        alert('Hubo un error al procesar tu pedido. Por favor, verifica la conexión con el servidor e intenta de nuevo.');
        console.error(err);
      }
    });
  }
}
