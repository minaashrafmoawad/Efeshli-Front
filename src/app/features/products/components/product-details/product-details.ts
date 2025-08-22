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

  // Selection state for options
  selectedFabricIndex = signal<number>(2); // Default: Mint Blue Linen
  selectedWoodIndex = signal<number>(3);   // Default: EI-M-07/ Natural Oak  
  selectedColorIndex = signal<number>(2);  // Default: Mint Blue

  // Fabric options data
  fabricOptions = [
    { name: 'Silver Mist', color: '#d3d3d3' },
    { name: 'Textured Baby Blue', color: '#87ceeb' },
    { name: 'Mint Blue Linen', color: '#a3c9a8' },
    { name: 'Plain Grey', color: '#708090' },
    { name: 'Honey Linen', color: '#d2b48c' },
    { name: 'Boize - Cute Fabric', color: '#5c4033' }
  ];

  // Wood options data
  woodOptions = [
    { name: 'EI-M-03', color: '#f5f5dc' },
    { name: 'EI-M-04/ Warm Oak', color: '#8b4513' },
    { name: 'EI-M-06/ Black Wash', color: '#3c2f2f' },
    { name: 'EI-M-07/ Natural Oak', color: '#cd853f' },
    { name: 'Light Oak', color: '#f0e68c' },
    { name: 'EI-M-13/ Beige', color: '#f4a460' }
  ];

  // Color options data
  colorOptions = [
    { name: 'Silver Mist', color: '#d3d3d3' },
    { name: 'Textured Baby Blue', color: '#87ceeb' },
    { name: 'Mint Blue', color: '#a3c9a8' },
    { name: 'Plain Grey', color: '#708090' },
    { name: 'Honey Linen', color: '#d2b48c' },
    { name: 'Boize - Cute Fabric', color: '#5c4033' }
  ];

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

  nextImage(): void {
    if (!this.product()?.images || this.product()!.images.length <= 1) return;
    
    const currentIndex = this.selectedImageIndex();
    const newIndex = currentIndex < this.product()!.images.length - 1 ? currentIndex + 1 : 0;
    this.selectImage(newIndex);
  }

  previousImage(): void {
    if (!this.product()?.images || this.product()!.images.length <= 1) return;
    
    const currentIndex = this.selectedImageIndex();
    const newIndex = currentIndex > 0 ? currentIndex - 1 : this.product()!.images.length - 1;
    this.selectImage(newIndex);
  }

  // Keyboard navigation for images
  onImageKeydown(event: KeyboardEvent): void {
    if (!this.product()?.images || this.product()!.images.length <= 1) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previousImage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextImage();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.previousImage();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.nextImage();
        break;
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

  // Selection methods for options
  selectFabric(index: number) {
    this.selectedFabricIndex.set(index);
    console.log('Selected fabric:', this.fabricOptions[index].name);
  }

  selectWood(index: number) {
    this.selectedWoodIndex.set(index);
    console.log('Selected wood:', this.woodOptions[index].name);
  }

  selectColor(index: number) {
    this.selectedColorIndex.set(index);
    console.log('Selected color:', this.colorOptions[index].name);
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
