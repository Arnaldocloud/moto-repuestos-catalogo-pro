
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/types/order';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [sessionId, setSessionId] = useState<string>('');

  // Generar un ID de sesión único para usuarios no autenticados
  useEffect(() => {
    const generateSessionId = () => {
      let id = localStorage.getItem('guest_session_id');
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('guest_session_id', id);
      }
      return id;
    };

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Usuario autenticado: usar su ID
        setSessionId(session.user.id);
      } else {
        // Usuario no autenticado: usar ID de sesión generado
        setSessionId(generateSessionId());
      }
    };

    checkSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setSessionId(session.user.id);
          // Al autenticarse, limpiar carrito de invitado
          setItems([]);
          localStorage.removeItem('cart_guest');
        } else {
          setSessionId(generateSessionId());
          // Al cerrar sesión, limpiar carrito de usuario autenticado
          setItems([]);
          localStorage.removeItem('cart_auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Cargar carrito específico según tipo de sesión
  useEffect(() => {
    if (!sessionId) return;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const cartKey = session?.user ? 'cart_auth' : 'cart_guest';
      
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          console.log(`Cargando carrito ${cartKey} desde localStorage:`, parsedCart);
          setItems(parsedCart);
        } catch (error) {
          console.error('Error loading cart:', error);
          localStorage.removeItem(cartKey);
        }
      }
    };

    checkAuth();
  }, [sessionId]);

  // Guardar carrito específico según tipo de sesión
  useEffect(() => {
    if (!sessionId) return;

    const saveCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const cartKey = session?.user ? 'cart_auth' : 'cart_guest';
      
      console.log(`Guardando carrito ${cartKey} en localStorage:`, items);
      localStorage.setItem(cartKey, JSON.stringify(items));
    };

    saveCart();
  }, [items, sessionId]);

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

  const clearCart = useCallback(async () => {
    setItems([]);
    const { data: { session } } = await supabase.auth.getSession();
    const cartKey = session?.user ? 'cart_auth' : 'cart_guest';
    localStorage.removeItem(cartKey);
  }, []);

  const getTotal = useCallback(() => {
    try {
      if (!items || items.length === 0) {
        return 0;
      }
      
      const total = items.reduce((total, item) => {
        // Asegurar que todos los valores sean números válidos
        const price = Number(item.product_price) || 0;
        const quantity = Number(item.quantity) || 0;
        return total + (price * quantity);
      }, 0);
      
      // Asegurar que el total sea un número válido
      return isNaN(total) ? 0 : total;
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
  }, [items]);

  const getTotalItems = useCallback(() => {
    try {
      if (!items || items.length === 0) {
        return 0;
      }
      
      const total = items.reduce((total, item) => {
        const quantity = Number(item.quantity) || 0;
        return total + quantity;
      }, 0);
      
      return isNaN(total) ? 0 : total;
    } catch (error) {
      console.error('Error calculating total items:', error);
      return 0;
    }
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
