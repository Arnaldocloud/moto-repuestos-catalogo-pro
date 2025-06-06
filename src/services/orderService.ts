
import { supabase } from '@/integrations/supabase/client';
import { CreateOrderData, Order, OrderItem, OrderStatus } from '@/types/order';

export const createOrderWithItems = async (orderData: CreateOrderData): Promise<Order> => {
  try {
    // Crear la orden principal
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address,
        customer_city: orderData.customer_city,
        notes: orderData.notes,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Error creating order: ${orderError.message}`);
    }

    // Crear los items de la orden
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Si hay error con los items, intentar eliminar la orden
      await supabase.from('orders').delete().eq('id', order.id);
      throw new Error(`Error creating order items: ${itemsError.message}`);
    }

    // Cast the status to OrderStatus type
    return {
      ...order,
      status: order.status as OrderStatus
    };

  } catch (error) {
    console.error('Error in createOrderWithItems:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      throw new Error(`Error fetching order: ${error.message}`);
    }

    // Cast the status to OrderStatus type
    return {
      ...data,
      status: data.status as OrderStatus
    };
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
};

export const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) {
      throw new Error(`Error fetching order items: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error getting order items:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
