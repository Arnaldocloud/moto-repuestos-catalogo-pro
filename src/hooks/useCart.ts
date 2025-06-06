
import { useState, useEffect } from 'react';
import { CartItem } from '@/types/order';
import { Product } from '@/types/product';
import { toast } from 'sonner';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product_id === product.id);
      
      if (existingItem) {
        toast.success('Cantidad actualizada en el carrito');
        return currentItems.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          product_id: product.id,
          product_name: product.name,
          product_sku: product.sku,
          product_price: product.discountPrice || product.price,
          quantity,
          product_image: product.images?.[0]
        };
        toast.success('Producto agregado al carrito');
        return [...currentItems, newItem];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product_id !== productId));
    toast.success('Producto eliminado del carrito');
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    items,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getTotalItems
  };
};
