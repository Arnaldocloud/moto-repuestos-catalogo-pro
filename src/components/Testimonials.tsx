
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Carlos Rodríguez",
      location: "Caracas",
      rating: 5,
      comment: "Excelente servicio, encontré el repuesto para mi Honda CB 190 rápidamente. Llegó en perfecto estado y el precio muy competitivo.",
      bike: "Honda CB 190"
    },
    {
      name: "María González",
      location: "Maracaibo",
      rating: 5,
      comment: "La atención por WhatsApp es increíble. Me ayudaron a identificar exactamente qué pastillas necesitaba para mi Yamaha. Súper recomendados.",
      bike: "Yamaha FZ 150"
    },
    {
      name: "José Martínez",
      location: "Valencia",
      rating: 5,
      comment: "Ya es la tercera vez que compro aquí. Siempre productos originales y entrega rápida. Se nota que conocen de motos.",
      bike: "Bajaj Pulsar 200"
    },
    {
      name: "Ana Silva",
      location: "Barquisimeto",
      rating: 5,
      comment: "Necesitaba un filtro urgente y me lo consiguieron el mismo día. El envío llegó súper rápido y bien empacado.",
      bike: "AKT 125"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
        <p className="text-muted-foreground mb-8">
          Miles de motociclistas confían en nosotros para mantener sus motos en perfecto estado
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-4 italic">
                "{testimonial.comment}"
              </p>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{testimonial.bike}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold mb-2">¿Ya compraste con nosotros?</h3>
        <p className="text-sm text-muted-foreground">
          Nos encantaría conocer tu experiencia. Contáctanos para dejar tu testimonio.
        </p>
      </div>
    </div>
  );
};

export default Testimonials;
