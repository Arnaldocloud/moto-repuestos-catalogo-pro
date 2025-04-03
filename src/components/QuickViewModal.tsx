
import React, { useState } from "react";
import { Product } from "@/types/product";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Share2, ShoppingCart, Tag, X, ChevronLeft, ChevronRight } from "lucide-react";
import { createWhatsAppLink, createProductQuery } from "@/config/contact";
import InstallmentCalculator from "./InstallmentCalculator";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const [showInstallments, setShowInstallments] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const { 
    name, price, discountPrice, brand, sku, images, 
    description, features, stock, compatibleModels 
  } = product;

  const hasDiscount = discountPrice !== undefined && discountPrice < price;
  const discountPercentage = hasDiscount 
    ? Math.round(((price - discountPrice!) / price) * 100) 
    : 0;

  const whatsappLink = createWhatsAppLink(createProductQuery(name, sku));
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">{name}</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="flex items-center gap-2">
            <span>SKU: {sku}</span>
            <span>•</span>
            <span>{brand}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Carousel */}
          <div className="relative rounded-lg overflow-hidden">
            <div className="aspect-square relative">
              <img 
                src={images[currentImageIndex]} 
                alt={name} 
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
              
              {/* Discount Badge */}
              {hasDiscount && (
                <Badge className="absolute top-2 left-2 bg-primary hover:bg-primary/90">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex justify-center mt-2 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 rounded overflow-hidden border-2 ${
                      index === currentImageIndex ? "border-primary" : "border-border"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="flex flex-col">
            {/* Price */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl font-bold text-primary">
                      ${discountPrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">${price.toFixed(2)}</span>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground mt-1">
                Stock disponible: {stock} unidades
              </div>
            </div>
            
            {/* Compatible Models */}
            {compatibleModels && compatibleModels.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Compatible con:</h4>
                <div className="flex flex-wrap gap-1">
                  {compatibleModels.map((model, index) => (
                    <Badge key={index} variant="outline">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Descripción:</h4>
              <p className="text-sm">{description}</p>
            </div>
            
            {/* Features */}
            {features && features.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Características:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <Separator className="my-4" />
            
            {/* Buttons */}
            <div className="flex flex-col gap-2 mt-auto">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  className="w-full"
                  disabled={stock === 0}
                  onClick={() => window.open(whatsappLink, '_blank')}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {stock === 0 ? "Agotado" : "Consultar"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </a>
                </Button>
              </div>
              
              <Button 
                variant="secondary" 
                onClick={() => setShowInstallments(!showInstallments)}
              >
                {showInstallments ? "Ocultar calculadora" : "Calcular cuotas"}
              </Button>
              
              {showInstallments && (
                <div className="mt-2">
                  <InstallmentCalculator 
                    price={hasDiscount ? discountPrice! : price} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
