import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgIf, NgFor, TitleCasePipe, KeyValuePipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, map, of } from 'rxjs';
import { ProductService } from '../../../../core/services/product.service';
import { Iproduct } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
  imports: [RouterLink, CurrencyPipe, DatePipe, KeyValuePipe, CommonModule, NgIf, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  // Reactive signals for state management
  product = signal<Iproduct | undefined>(undefined);
  isLoading = signal(true);
  error = signal<string | null>(null);
  selectedImageIndex = signal(0);
  quantity = signal(1);

  // Computed values
  selectedImage = computed(() => {
    const prod = this.product();
    const index = this.selectedImageIndex();
    return prod?.images[index] || '';
  });

  totalPrice = computed(() => {
    const prod = this.product();
    const qty = this.quantity();
    return prod ? prod.price * qty : 0;
  });

  deliveryDateRange = computed(() => {
    const prod = this.product();
    if (!prod?.madeToOrder || !prod.deliveryMinDays || !prod.deliveryMaxDays) {
      return null;
    }
    
    const today = new Date();
    const minDate = new Date(today.getTime() + (prod.deliveryMinDays * 24 * 60 * 60 * 1000));
    const maxDate = new Date(today.getTime() + (prod.deliveryMaxDays * 24 * 60 * 60 * 1000));
    
    return {
      min: minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      max: maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        const slug = params.get('slug');
        
        this.isLoading.set(true);
        this.error.set(null);
        
        if (id) {
          // Handle ID-based routing
          const product = this.productService.getById(Number(id));
          return of(product);
        } else if (slug) {
          // Handle slug-based routing (if you want to support both)
          return this.productService.getBySlug(slug);
        } else {
          this.error.set('Invalid product identifier');
          return of(undefined);
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (product) => {
        if (product) {
          this.product.set(product);
        } else {
          this.error.set('Product not found');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product');
        this.isLoading.set(false);
        console.error('Error loading product:', err);
      }
    });
  }

  // Image navigation methods
  selectImage(index: number) {
    const prod = this.product();
    if (prod && index >= 0 && index < prod.images.length) {
      this.selectedImageIndex.set(index);
    }
  }

  nextImage() {
    const prod = this.product();
    if (prod) {
      const currentIndex = this.selectedImageIndex();
      const nextIndex = (currentIndex + 1) % prod.images.length;
      this.selectedImageIndex.set(nextIndex);
    }
  }

  previousImage() {
    const prod = this.product();
    if (prod) {
      const currentIndex = this.selectedImageIndex();
      const prevIndex = currentIndex === 0 ? prod.images.length - 1 : currentIndex - 1;
      this.selectedImageIndex.set(prevIndex);
    }
  }

  // Quantity management
  increaseQuantity() {
    this.quantity.update(qty => qty + 1);
  }

  decreaseQuantity() {
    this.quantity.update(qty => Math.max(1, qty - 1));
  }

  setQuantity(value: number) {
    if (value >= 1) {
      this.quantity.set(value);
    }
  }

  // Actions
  addToCart() {
    const prod = this.product();
    const qty = this.quantity();
    
    if (prod) {
      // Implement your cart logic here
      console.log(`Adding ${qty} x ${prod.name} to cart`);
      // You might emit an event or call a cart service
    }
  }

  buyNow() {
    const prod = this.product();
    const qty = this.quantity();
    
    if (prod) {
      // Implement immediate checkout logic
      console.log(`Buy now: ${qty} x ${prod.name}`);
      // Navigate to checkout or call checkout service
    }
  }

  addToWishlist() {
    const prod = this.product();
    if (prod) {
      // Implement wishlist logic
      console.log(`Added ${prod.name} to wishlist`);
    }
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}