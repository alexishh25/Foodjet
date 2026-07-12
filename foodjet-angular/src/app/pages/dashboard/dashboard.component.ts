import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  readonly currentUser = this.cartService.currentUser;

  activeTab: 'summary' | 'orders' | 'users' = 'summary';
  orders: any[] = [];
  users: any[] = [];
  isLoading = false;

  @ViewChild('salesChartCanvas') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topProductsChartCanvas') topProductsChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChartCanvas') categoryChartCanvas!: ElementRef<HTMLCanvasElement>;

  private chartInstances: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    if (this.activeTab === 'summary') {
      setTimeout(() => this.renderCharts(), 200);
    }
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  changeTab(tab: 'summary' | 'orders' | 'users') {
    this.activeTab = tab;
    this.destroyCharts();
    
    if (tab === 'summary') {
      setTimeout(() => this.renderCharts(), 100);
    }
  }

  loadData() {
    this.isLoading = true;
    
    this.cartService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        if (this.activeTab === 'summary') {
          this.destroyCharts();
          this.renderCharts();
        }
      },
      error: (err) => {
        console.error('Error al cargar pedidos del backend:', err);
      }
    });

    this.cartService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error al cargar usuarios del backend:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateStatus(orderId: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;
    
    this.cartService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = { ...updatedOrder };
        }
        alert('Estado de pedido actualizado exitosamente a: ' + this.getStatusText(newStatus));
        
        if (this.activeTab === 'summary') {
          this.destroyCharts();
          this.renderCharts();
        }
      },
      error: (err) => {
        alert('Error al actualizar el estado del pedido');
        console.error(err);
      }
    });
  }

  getOrderCode(orderId: number): string {
    return '#FJ' + String(orderId || 0).padStart(4, '0');
  }

  getStatusText(status: string): string {
    if (status === 'preparing') return 'Preparando';
    if (status === 'on-the-way') return 'En camino';
    if (status === 'delivered') return 'Entregado';
    return status;
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'preparing') return 'bg-warning text-dark';
    if (status === 'on-the-way') return 'bg-info text-dark';
    if (status === 'delivered') return 'bg-success text-white';
    return 'bg-secondary text-white';
  }

  getPaymentMethodText(method: string): string {
    return method === 'card' ? 'Tarjeta' : 'Efectivo';
  }

  logout() {
    this.cartService.logout();
    this.router.navigate(['/']);
  }

  private destroyCharts() {
    this.chartInstances.forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.chartInstances = [];
  }

  private renderCharts() {
    if (!this.salesChartCanvas || !this.topProductsChartCanvas || !this.categoryChartCanvas || typeof Chart === 'undefined') {
      return;
    }

    let salesData = [120, 190, 300, 500, 210, 350, 450];
    let topProductLabels = ['Hamburguesa', 'Pizza', 'Sushi', 'Tacos', 'Alitas BBQ'];
    let topProductValues = [65, 59, 80, 81, 56];
    let categoryLabels = ['Hamburguesas', 'Pizzas', 'Asiática', 'Mexicana', 'Postres'];
    let categoryValues = [300, 500, 400, 200, 150];

    if (this.orders && this.orders.length > 0) {
      const daySales: { [key: string]: number } = { 'Lunes': 0, 'Martes': 0, 'Miércoles': 0, 'Jueves': 0, 'Viernes': 0, 'Sábado': 0, 'Domingo': 0 };
      const daysMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      
      const productCounts: { [key: string]: number } = {};
      
      const categorySales: { [key: string]: number } = { 'Hamburguesas': 0, 'Pizzas': 0, 'Asiática': 0, 'Mexicana': 0, 'Postres': 0, 'Pollo': 0, 'Saludable': 0 };

      const productCategories: { [key: string]: string } = {};
      this.cartService.products().forEach(p => {
        productCategories[p.name] = p.category;
      });

      this.orders.forEach(order => {
        const date = new Date(order.createdAt);
        const dayName = daysMap[date.getDay()];
        if (daySales[dayName] !== undefined) {
          daySales[dayName] += order.totalPrice;
        }

        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            productCounts[item.productName] = (productCounts[item.productName] || 0) + item.quantity;

            const category = productCategories[item.productName] || 'Otros';
            categorySales[category] = (categorySales[category] || 0) + (item.price * item.quantity);
          });
        }
      });

      const totalSales = Object.values(daySales).reduce((a, b) => a + b, 0);
      if (totalSales > 0) {
        salesData = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => daySales[d]);
      }

      const sortedProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]);
      if (sortedProducts.length > 0) {
        topProductLabels = sortedProducts.slice(0, 5).map(p => p[0]);
        topProductValues = sortedProducts.slice(0, 5).map(p => p[1]);
      }

      const activeCategories = Object.entries(categorySales).filter(c => c[1] > 0);
      if (activeCategories.length > 0) {
        categoryLabels = activeCategories.map(c => c[0]);
        categoryValues = activeCategories.map(c => c[1]);
      }
    }

    const salesCtx = this.salesChartCanvas.nativeElement.getContext('2d');
    if (salesCtx) {
      const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
          labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
          datasets: [{
            label: 'Ventas (S/)',
            data: salesData,
            fill: false,
            borderColor: 'rgb(245, 175, 105)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
      this.chartInstances.push(salesChart);
    }

    const productsCtx = this.topProductsChartCanvas.nativeElement.getContext('2d');
    if (productsCtx) {
      const productsChart = new Chart(productsCtx, {
        type: 'bar',
        data: {
          labels: topProductLabels,
          datasets: [{
            label: 'Unidades Vendidas',
            data: topProductValues,
            backgroundColor: [
              'rgba(243, 157, 74, 0.5)',
              'rgba(245, 175, 105, 0.5)',
              'rgba(254, 243, 232, 0.8)',
              'rgba(108, 117, 125, 0.5)',
              'rgba(26, 26, 26, 0.5)',
            ],
            borderColor: [
              'rgb(243, 157, 74)',
              'rgb(245, 175, 105)',
              'rgb(254, 243, 232)',
              'rgb(108, 117, 125)',
              'rgb(26, 26, 26)',
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      this.chartInstances.push(productsChart);
    }

    const categoryCtx = this.categoryChartCanvas.nativeElement.getContext('2d');
    if (categoryCtx) {
      const categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
          labels: categoryLabels,
          datasets: [{
            label: 'Ventas por Categoría',
            data: categoryValues,
            backgroundColor: [
              '#f5af69',
              '#f39d4a',
              '#6c757d',
              '#fef3e8',
              '#1a1a1a',
              '#28a745',
              '#dc3545'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
      this.chartInstances.push(categoryChart);
    }
  }
}
