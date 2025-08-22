export interface Iproduct {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;          
  currency: 'EGP';
  vatIncluded: boolean;
  sku?: string;
  images: string[];       
  description: string;
  specs: Record<string, string | number | boolean>;
  additionalInfo?: string;
  shippingReturn?: string;
  madeToOrder?: boolean;
  deliveryMinDays?: number; 
  deliveryMaxDays?: number;
}