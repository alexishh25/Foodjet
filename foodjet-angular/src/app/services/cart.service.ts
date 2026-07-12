import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  name: string;
  email: string;
  role: 'customer' | 'admin';
  token?: string;
}

export interface BackendOrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface BackendOrder {
  id?: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerReference?: string;
  paymentMethod: string;
  totalPrice: number;
  status?: string;
  createdAt?: string;
  items: BackendOrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly ordersUrl = 'http://localhost:8080/api/orders';
  private readonly productsUrl = 'http://localhost:8080/api/products';

  readonly products = signal<Product[]>([]);

  readonly cart = signal<{ [key: number]: number }>({});
  readonly currentUser = signal<User | null>(null);
  
  readonly lastOrderPaymentMethod = signal<string>('cash');
  readonly lastCreatedOrder = signal<any>(null);

  constructor() {
    const savedUser = localStorage.getItem('foodjet_user');
    if (savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('foodjet_user');
      }
    }

    this.loadProducts();
  }

  private loadProducts() {
    this.http.get<Product[]>(this.productsUrl).subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (err) => {
        console.error('Error al cargar platos desde el backend:', err);
      }
    });
  }

  readonly cartItems = computed<CartItem[]>(() => {
    const currentCart = this.cart();
    const allProducts = this.products();
    return Object.entries(currentCart).map(([idStr, quantity]) => {
      const id = Number(idStr);
      const product = allProducts.find(p => p.id === id);
      return product ? { product, quantity } : null;
    }).filter((item): item is CartItem => item !== null);
  });

  readonly totalItems = computed<number>(() => {
    return Object.values(this.cart()).reduce((sum, qty) => sum + qty, 0);
  });

  readonly cartSubtotal = computed<number>(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  readonly deliveryFee = 5.00;

  readonly cartTotal = computed<number>(() => {
    return this.cartSubtotal() + this.deliveryFee;
  });

  addToCart(productId: number) {
    this.cart.update(current => {
      const qty = current[productId] || 0;
      return { ...current, [productId]: qty + 1 };
    });
  }

  removeFromCart(productId: number) {
    this.cart.update(current => {
      const qty = current[productId] || 0;
      if (qty <= 1) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: qty - 1 };
    });
  }

  removeItemCompletely(productId: number) {
    this.cart.update(current => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }

  clearCart() {
    this.cart.set({});
  }

  private getHeaders() {
    const user = this.currentUser();
    if (user && user.token) {
      return {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
    }
    return {};
  }

  login(email: string, password?: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem('foodjet_user', JSON.stringify(user));
      })
    );
  }

  register(name: string, email: string, password?: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { name, email, password });
  }

  quickDemoLogin() {
    const user: User = { name: 'Usuario Demo', email: 'demo@foodjet.com', role: 'customer', token: 'demo-token' };
    this.currentUser.set(user);
    localStorage.setItem('foodjet_user', JSON.stringify(user));
    return user;
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('foodjet_user');
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, this.getHeaders());
  }

  createOrder(order: BackendOrder): Observable<any> {
    return this.http.post<any>(this.ordersUrl, order, this.getHeaders()).pipe(
      tap(createdOrder => {
        this.lastCreatedOrder.set(createdOrder);
      })
    );
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.ordersUrl, this.getHeaders());
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.ordersUrl}/${orderId}`, this.getHeaders());
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.ordersUrl}/${orderId}/status`, { status }, this.getHeaders());
  }
}
