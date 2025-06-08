
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Package, CheckCircle, XCircle, Clock, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OrderStatus } from "@/types/order";
import OrderDetailsDialog from "./orders/OrderDetailsDialog";
import { updateOrderStatus } from "@/services/orderService";
import { toast } from "sonner";

const OrdersAdmin: React.FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }
  });

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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Estado del pedido actualizado correctamente');
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error al actualizar el estado del pedido');
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  const ordersByStatus = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Pedidos</h2>
          <p className="text-muted-foreground">
            Administra y da seguimiento a todos los pedidos de la tienda
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStatusFilter('all')}>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{ordersByStatus.all}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStatusFilter('pending')}>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{ordersByStatus.pending}</div>
              <div className="text-xs text-muted-foreground">Pendientes</div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStatusFilter('confirmed')}>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{ordersByStatus.confirmed}</div>
              <div className="text-xs text-muted-foreground">Confirmados</div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStatusFilter('processing')}>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{ordersByStatus.processing}</div>
              <div className="text-xs text-muted-foreground">Procesando</div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStatusFilter('shipped')}>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{ordersByStatus.shipped}</div>
              <div className="text-xs text-muted-foreground">Enviados</div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStatusFilter('delivered')}>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{ordersByStatus.delivered}</div>
              <div className="text-xs text-muted-foreground">Entregados</div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setStatusFilter('cancelled')}>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{ordersByStatus.cancelled}</div>
              <div className="text-xs text-muted-foreground">Cancelados</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pedidos {statusFilter !== 'all' && `- ${statusFilter}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay pedidos {statusFilter !== 'all' ? `con estado "${statusFilter}"` : ''}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">Pedido #{order.id.slice(0, 8)}</h3>
                        <Badge className={getStatusColor(order.status as OrderStatus)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status as OrderStatus)}
                            {order.status}
                          </div>
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Cliente:</strong> {order.customer_name}</p>
                        <p><strong>Email:</strong> {order.customer_email}</p>
                        <p><strong>Teléfono:</strong> {order.customer_phone}</p>
                        <p><strong>Total:</strong> ${order.total_amount}</p>
                        <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                      
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                        >
                          Confirmar
                        </Button>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'processing')}
                        >
                          Procesar
                        </Button>
                      )}
                      
                      {order.status === 'processing' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'shipped')}
                        >
                          Enviar
                        </Button>
                      )}
                      
                      {order.status === 'shipped' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                        >
                          Entregar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedOrderId && (
        <OrderDetailsDialog
          orderId={selectedOrderId}
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default OrdersAdmin;
