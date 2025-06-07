
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/types/order';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("Cargando carrito desde localStorage:", parsedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    console.log("Guardando carrito en localStorage:", items);
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    console.log("addItem llamado con:", product.name, "cantidad:", quantity);
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product_id === product.id);
      
      if (existingItem) {
        toast.success('Cantidad actualizada en el carrito');
        const updatedItems = currentItems.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        console.log("Items después de actualizar cantidad:", updatedItems);
        return updatedItems;
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
        const updatedItems = [...currentItems, newItem];
        console.log("Items después de agregar nuevo producto:", updatedItems);
        return updatedItems;
      }
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product_id !== productId));
    toast.success('Producto eliminado del carrito');
  }, []);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
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
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cart');
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      setIsOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
