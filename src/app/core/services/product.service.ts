import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Iproduct } from '../models/product.model';
// ...existing code...

@Injectable({ providedIn: 'root' })
export class ProductService {
  data!: Iproduct[];
  constructor() {
    this.data = [
      {
        id: 1,
        slug: 'tornado-multifunction-hand-blender-thb-1000mkl',
        name: 'Mini Vintage Chair In Plywood & Pine Wood - Upholstered',
        brand: 'Tornado',
      category: 'Food Processor',
      price: 4367,
      currency: 'EGP',
      vatIncluded: true,
      images: [
        '/assets/0.png',
        '/assets/1.png',
        '/assets/2.png',
        '/assets/3.png',
      ],
      description:
        'High-performance multifunction hand blender with 1.5L bowl and 1000W motor for blending, chopping, and whisking.',
      specs: {
        Power: '1000 W',
        Capacity: '1.5 L',
        Color: 'Black',
        Model: 'THB-1000MKL',
        Warranty: '1 Year',
      },
      additionalInfo:
        'Includes blender shaft, whisk, chopper, and 1.5L processor bowl.',
      shippingReturn:
        'Free returns within 14 days in original packaging. Shipping fees may apply based on location.',
      madeToOrder: true,
      deliveryMinDays: 3,
      deliveryMaxDays: 8,
      },
      {
        id: 2,
        slug: 'tornado-multifunction-hand-blender-thb-1000mkl',
        name: 'TORNADO Multifunction Hand Blender, 1.5 Liter, 1000 Watt, Black - THB-1000MKL',
        brand: 'Tornado',
        category: 'Food Processor',
        price: 4367,
        currency: 'EGP',
        vatIncluded: true,
        images: [
          './assets/chir2.png',
          './assets/chir1.png',
          './assets/chir2.png',
          
        ],
        description:
          'Made out of pine and plywood and fully upholstered to guarantee both sturdiness and comfort.',
        specs: {
          Color_Ar: 'Black',
          Life_span: '1 Year',
          Warranty: '1 Year',
          bm_power_consumption: '100 Watt',
          bm_capacity: '1.5 Liter',
          blender_type: 'Multifunction Hand Blender',
        },
        additionalInfo:
          'Includes blender shaft, whisk, chopper, and 1.5L processor bowl.',
        shippingReturn:
          'Free returns within 14 days in original packaging. Shipping fees may apply based on location.',
        madeToOrder: true,
        deliveryMinDays: 3,
        deliveryMaxDays: 8,
      }
    ]
  }
  

getById(id:number):Iproduct | undefined {
    return this.data.find(x => x.id === id) as Iproduct;
  }

  getBySlug(slug: string): Observable<Iproduct | undefined> {
    const p = this.data.find(x => x.slug === slug);
    return of(p).pipe(delay(300)); // سيموليشن للودينج بسيط
  }
}
