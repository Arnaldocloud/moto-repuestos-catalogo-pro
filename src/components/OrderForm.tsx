
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Upload } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { createOrderWithItems } from '@/services/orderService';
import { toast } from 'sonner';
import { createWhatsAppLink } from '@/config/contact';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose }) => {
  const { items, getTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    customer_city: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo (solo imágenes)
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen válida');
        return;
      }
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB');
        return;
      }
      setPaymentProof(file);
      toast.success('Comprobante cargado correctamente');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('No hay productos en el carrito');
      return;
    }

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!paymentProof) {
      toast.error('Por favor sube el comprobante de pago móvil');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_sku: item.product_sku,
          quantity: item.quantity,
          unit_price: item.product_price
        }))
      };

      const order = await createOrderWithItems(orderData);

      // Crear mensaje para WhatsApp
      let whatsappMessage = `🛒 NUEVA ORDEN DE COMPRA\n\n`;
      whatsappMessage += `📋 Orden ID: ${order.id}\n`;
      whatsappMessage += `👤 Cliente: ${formData.customer_name}\n`;
      whatsappMessage += `📧 Email: ${formData.customer_email}\n`;
      whatsappMessage += `📱 Teléfono: ${formData.customer_phone}\n`;
      
      if (formData.customer_address) {
        whatsappMessage += `📍 Dirección: ${formData.customer_address}\n`;
      }
      if (formData.customer_city) {
        whatsappMessage += `🏙️ Ciudad: ${formData.customer_city}\n`;
      }
      
      whatsappMessage += `\n📦 PRODUCTOS:\n`;
      items.forEach(item => {
        whatsappMessage += `• ${item.product_name} (${item.product_sku})\n`;
        whatsappMessage += `  Cantidad: ${item.quantity} x $${item.product_price}\n`;
        whatsappMessage += `  Subtotal: $${(item.quantity * item.product_price).toFixed(2)}\n\n`;
      });
      
      whatsappMessage += `💰 TOTAL: $${getTotal().toFixed(2)}\n\n`;
      whatsappMessage += `💳 COMPROBANTE DE PAGO MÓVIL: Adjunto en archivo\n`;
      whatsappMessage += `📄 Nombre del comprobante: ${paymentProof.name}\n\n`;
      
      if (formData.notes) {
        whatsappMessage += `📝 Notas: ${formData.notes}\n\n`;
      }
      
      whatsappMessage += `¡Gracias por tu pedido! Te contactaremos pronto para confirmar los detalles.`;

      // Abrir WhatsApp
      const whatsappUrl = createWhatsAppLink(whatsappMessage);
      window.open(whatsappUrl, '_blank');

      toast.success('Pedido enviado exitosamente', {
        description: 'Te contactaremos pronto para confirmar tu pedido. No olvides enviar el comprobante por WhatsApp.'
      });

      clearCart();
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        customer_city: '',
        notes: ''
      });
      setPaymentProof(null);
      onClose();

    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al procesar el pedido', {
        description: 'Por favor intenta de nuevo'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirmar Pedido</DialogTitle>
          <DialogDescription>
            Completa tus datos y sube el comprobante de pago móvil para procesar el pedido
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resumen del pedido */}
          <div className="space-y-4">
            <h3 className="font-semibold">Resumen del Pedido</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product_name} x {item.quantity}</span>
                  <span>${(item.product_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Datos del cliente */}
          <div className="space-y-4">
            <h3 className="font-semibold">Datos del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Nombre Completo *</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email *</Label>
                <Input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_phone">Teléfono *</Label>
                <Input
                  id="customer_phone"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_city">Ciudad</Label>
                <Input
                  id="customer_city"
                  name="customer_city"
                  value={formData.customer_city}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_address">Dirección</Label>
              <Input
                id="customer_address"
                name="customer_address"
                value={formData.customer_address}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Cualquier información adicional sobre tu pedido..."
              />
            </div>
          </div>

          <Separator />

          {/* Comprobante de pago */}
          <div className="space-y-4">
            <h3 className="font-semibold">Comprobante de Pago Móvil *</h3>
            <div className="space-y-2">
              <Label htmlFor="payment_proof">Subir comprobante (imagen)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="payment_proof"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              {paymentProof && (
                <p className="text-sm text-green-600">
                  ✓ Archivo seleccionado: {paymentProof.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Sube una imagen del comprobante de tu pago móvil. Máximo 5MB.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Procesando...' : 'Enviar Pedido'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
