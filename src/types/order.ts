
export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  product_price: number;
  quantity: number;
  product_image?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address?: string;
  customer_city?: string;
  total_amount: number;
  status: OrderStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CreateOrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address?: string;
  customer_city?: string;
  notes?: string;
  items: Array<{
    product_id: string;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;
  }>;
}
