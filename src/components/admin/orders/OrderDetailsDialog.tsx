
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Mail, MapPin, Package, Calendar, FileText } from "lucide-react";
import { getOrderById, getOrderItems } from "@/services/orderService";
import { OrderStatus } from "@/types/order";

interface OrderDetailsDialogProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  orderId,
  isOpen,
  onClose,
  onStatusChange
}) => {
  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId && isOpen
  });

  const { data: orderItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['order-items', orderId],
    queryFn: () => getOrderItems(orderId),
    enabled: !!orderId && isOpen
  });

  const handleStatusChange = async (newStatus: string) => {
    if (order) {
      await onStatusChange(order.id, newStatus as OrderStatus);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'processing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'shipped': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (orderLoading || itemsLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!order) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="text-center p-8">
            <p className="text-muted-foreground">No se pudo cargar la información del pedido</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalles del Pedido #{order.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Estado actual del pedido
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Cambiar estado:</span>
              <Select onValueChange={handleStatusChange} defaultValue={order.status}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="processing">Procesando</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Nombre:</span>
                  <span>{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span>{order.customer_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Teléfono:</span>
                  <span>{order.customer_phone}</span>
                </div>
                {order.customer_city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Ciudad:</span>
                    <span>{order.customer_city}</span>
                  </div>
                )}
              </div>
              {order.customer_address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="font-medium">Dirección:</span>
                  <span>{order.customer_address}</span>
                </div>
              )}
              {order.notes && (
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="font-medium">Notas:</span>
                  <span>{order.notes}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {item.product_sku}</p>
                      <p className="text-sm">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.total_price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.unit_price.toFixed(2)} c/u
                      </p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total del Pedido:</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fechas del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Fecha de creación:</span>
                <span>{new Date(order.created_at).toLocaleString('es-ES')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Última actualización:</span>
                <span>{new Date(order.updated_at).toLocaleString('es-ES')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
