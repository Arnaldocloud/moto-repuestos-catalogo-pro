
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  discountPrice?: number; // Precio con descuento, si aplica
  brand: string; // Marca del repuesto
  category: Category;
  compatibleModels: string[]; // Modelos de motos compatibles
  description: string;
  features: string[]; // Características técnicas
  images: string[];
  stock: number;
  isNew?: boolean; // Para marcar productos nuevos
  isSpecialOrder?: boolean; // Para productos por pedido especial
}

export type Category = 
  | 'motor'
  | 'frenos'
  | 'electricos'
  | 'suspension'
  | 'carroceria'
  | 'aceites'
  | 'filtros'
  | 'transmision'
  | 'llantas'
  | 'accesorios';

export const categoryNames: Record<Category, string> = {
  motor: 'Motor',
  frenos: 'Frenos',
  electricos: 'Eléctricos',
  suspension: 'Suspensión',
  carroceria: 'Carrocería',
  aceites: 'Aceites',
  filtros: 'Filtros',
  transmision: 'Transmisión',
  llantas: 'Llantas',
  accesorios: 'Accesorios'
};
