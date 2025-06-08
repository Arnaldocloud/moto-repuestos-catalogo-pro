
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ProductsAdmin from "@/components/admin/ProductsAdmin";
import CategoriesAdmin from "@/components/admin/CategoriesAdmin";
import OrdersAdmin from "@/components/admin/OrdersAdmin";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ConnectionStatus from "@/components/ConnectionStatus";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("products");

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona productos, categorías y pedidos de tu tienda
          </p>
          <div className="mt-2">
            <ConnectionStatus />
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la tienda
          </Link>
        </Button>
      </div>
      
      <Separator className="my-6" />
      
      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-none md:flex mb-8">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          <ProductsAdmin />
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <CategoriesAdmin />
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <OrdersAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
