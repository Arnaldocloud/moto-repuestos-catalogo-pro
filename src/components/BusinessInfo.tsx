
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Shield, Clock, Star, Users, Award } from "lucide-react";

const BusinessInfo = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Garantía de Calidad",
      description: "Todos nuestros productos cuentan con garantía y certificación de calidad"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Envíos Rápidos",
      description: "Entrega en 24-48 horas en Caracas y 3-5 días resto del país"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Atención 6 Días",
      description: "Lunes a sábado con horarios extendidos para tu comodidad"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Expertos en Motos",
      description: "Más de 10 años ayudando motociclistas a mantener sus motos"
    }
  ];

  const stats = [
    { number: "5000+", label: "Clientes Satisfechos" },
    { number: "15000+", label: "Repuestos Vendidos" },
    { number: "50+", label: "Marcas Disponibles" },
    { number: "24/7", label: "Soporte WhatsApp" }
  ];

  return (
    <div className="space-y-8">
      {/* Estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Números que nos respaldan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Características del negocio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="h-full">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Marcas y certificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Marcas que manejamos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "Honda", "Yamaha", "Suzuki", "Kawasaki", "Bajaj", "TVS", 
              "AKT", "Auteco", "Hero", "UM", "Kymco", "Zongshen"
            ].map((brand) => (
              <Badge key={brand} variant="outline" className="text-sm">
                {brand}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Y muchas más marcas. Si no encuentras la tuya, contáctanos y te conseguimos el repuesto.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInfo;
