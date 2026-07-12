import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tracking.component.html',
  styleUrls: []
})
export class TrackingComponent implements OnInit, OnDestroy {
  private readonly cartService = inject(CartService);

  status: 'preparing' | 'on-the-way' | 'delivered' = 'preparing';
  orderNumber = '';
  orderDate = '';
  paymentMethod = 'cash';

  private timers: any[] = [];

  ngOnInit() {
    const lastOrder = this.cartService.lastCreatedOrder();
    if (lastOrder) {
      this.orderNumber = '#FJ' + String(lastOrder.id).padStart(4, '0');
      
      if (lastOrder.createdAt) {
        this.orderDate = new Date(lastOrder.createdAt).toLocaleDateString('es-PE');
      } else {
        this.orderDate = new Date().toLocaleDateString('es-PE');
      }
      
      this.paymentMethod = lastOrder.paymentMethod;
      this.status = lastOrder.status || 'preparing';

      if (lastOrder.id && this.status !== 'delivered') {
        const intervalId = setInterval(() => {
          this.cartService.getOrderById(lastOrder.id).subscribe({
            next: (updatedOrder) => {
              if (updatedOrder && updatedOrder.status) {
                this.status = updatedOrder.status;
                if (this.status === 'delivered') {
                  clearInterval(intervalId);
                }
              }
            },
            error: (err) => {
              console.error('Error al consultar estado del pedido en tiempo real:', err);
            }
          });
        }, 5000);
        this.timers.push(intervalId);
      }
    } else {
      this.orderNumber = '#FJ' + Math.floor(1000 + Math.random() * 9000);
      this.orderDate = new Date().toLocaleDateString('es-PE');
      this.paymentMethod = this.cartService.lastOrderPaymentMethod();

      const t1 = setTimeout(() => {
        this.status = 'on-the-way';
      }, 8000);
      this.timers.push(t1);

      const t2 = setTimeout(() => {
        this.status = 'delivered';
      }, 18000);
      this.timers.push(t2);
    }
  }

  ngOnDestroy() {
    this.timers.forEach(t => clearTimeout(t));
  }

  getStatusTitle(): string {
    if (this.status === 'preparing') return 'Preparando tu pedido';
    if (this.status === 'on-the-way') return '¡En camino!';
    return '¡Entregado!';
  }

  getStatusDescription(): string {
    if (this.status === 'preparing') return 'Tu pedido está siendo preparado con mucho cuidado';
    if (this.status === 'on-the-way') return 'Tu pedido está en camino a tu ubicación';
    return 'Tu pedido ha sido entregado. ¡Que lo disfrutes!';
  }

  getEstimatedTime(): string {
    if (this.status === 'preparing') return 'Tiempo estimado: 30 minutos';
    if (this.status === 'on-the-way') return 'Tiempo estimado: 15 minutos';
    return '';
  }

  getPaymentMethodText(): string {
    return this.paymentMethod === 'card' ? 'Tarjeta de crédito/débito' : 'Efectivo al recibir';
  }
}
