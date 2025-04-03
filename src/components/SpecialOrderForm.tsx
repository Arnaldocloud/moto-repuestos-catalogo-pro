
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createWhatsAppLink, createSpecialOrderMessage, STORE_NAME } from "@/config/contact";
import { AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SpecialOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const SpecialOrderForm: React.FC<SpecialOrderFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    productName: "",
    details: "",
    name: "",
    phone: "",
    budget: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.productName.trim()) {
      newErrors.productName = "Ingresa el nombre del producto";
    }
    
    if (!formData.details.trim()) {
      newErrors.details = "Ingresa detalles del producto";
    }
    
    if (!formData.name.trim()) {
      newErrors.name = "Ingresa tu nombre";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Ingresa tu número de teléfono";
    } else if (!/^\d{6,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Ingresa un número de teléfono válido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const whatsappMessage = createSpecialOrderMessage(
        formData.productName,
        formData.details,
        formData.name,
        formData.phone,
        formData.budget
      );
      
      const whatsappLink = createWhatsAppLink(whatsappMessage);
      window.open(whatsappLink, "_blank");
      
      toast({
        title: "Solicitud enviada",
        description: `Tu pedido especial ha sido enviado a ${STORE_NAME}. Te contactaremos pronto.`,
      });
      
      onClose();
      
      // Reset form
      setFormData({
        productName: "",
        details: "",
        name: "",
        phone: "",
        budget: ""
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Solicitar repuesto especial</DialogTitle>
          <DialogDescription>
            Completa el formulario para solicitar un repuesto específico que no encuentres en nuestro catálogo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="productName">
                Nombre del repuesto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="productName"
                name="productName"
                placeholder="Ej: Pistón para Honda CG 150"
                value={formData.productName}
                onChange={handleChange}
              />
              {errors.productName && (
                <div className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.productName}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="details">
                Detalles y especificaciones <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="details"
                name="details"
                placeholder="Describe el repuesto lo más detallado posible (marca, modelo, año, medidas, etc.)"
                rows={4}
                value={formData.details}
                onChange={handleChange}
              />
              {errors.details && (
                <div className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.details}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="budget">
                Presupuesto aproximado (opcional)
              </Label>
              <Input
                id="budget"
                name="budget"
                placeholder="Ej: $50-100"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">
                Tu nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">
                Tu teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Número de WhatsApp"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <div className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Enviar solicitud</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialOrderForm;
