
import React from "react";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Share2, Eye, Tag, ShoppingCart } from "lucide-react";
import { createWhatsAppLink, createProductQuery } from "@/config/contact";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

// Helper para formatear precio de forma segura
const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null) {
    return "0.00";
  }
  return price.toFixed(2);
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { name, price, discountPrice, brand, sku, images, isNew, stock, compatibleModels } = product;
  const { addItem } = useCart();
  
  const hasDiscount = discountPrice !== undefined && discountPrice !== null && discountPrice < (price || 0);
  const discountPercentage = hasDiscount && price 
    ? Math.round(((price - discountPrice!) / price) * 100) 
    : 0;

  const whatsappLink = createWhatsAppLink(createProductQuery(name, sku));
  
  const handleShare = () => {
    toast.success("Enlace copiado al portapapeles", {
      description: "Ahora puedes compartirlo con quien quieras",
      duration: 3000,
    });
  };

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  return (
    <Card className="h-full product-card-hover overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0 relative">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">NUEVO</Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-primary text-primary hover:bg-primary/90 font-semibold animate-fade-in">-{discountPercentage}%</Badge>
          )}
          {stock !== undefined && stock <= 5 && stock > 0 && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-500 hover:bg-yellow-200 font-semibold">
              ¡Últimas unidades!
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-500 hover:bg-red-200 font-semibold">
              Agotado
            </Badge>
          )}
        </div>
        
        {/* SKU Badge */}
        <div className="absolute top-2 right-2 z-20">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                  <Tag className="h-3 w-3 mr-1" aria-hidden="true" /> {sku}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Código SKU</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={images && images.length > 0 ? images[0] : '/placeholder.svg'} 
            alt={name} 
            className="w-full h-full object-cover product-image-zoom"
            loading="lazy"
            width="400"
            height="400"
          />
          
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 opacity-0 hover:opacity-100 flex items-center justify-center">
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white hover:bg-white/90 text-gray-800 scale-95 hover:scale-100 transition-transform sm:text-sm md:text-base py-2 px-4"
              onClick={() => onQuickView(product)}
              aria-label={`Vista rápida de ${name}`}
            >
              <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
              Vista rápida
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-1">{brand}</div>
          <h3 className="font-medium text-lg line-clamp-2 min-h-[3.5rem]">{name}</h3>
          
          {/* Compatible models */}
          {compatibleModels && compatibleModels.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Compatible con:</p>
              <div className="flex flex-wrap gap-1">
                {compatibleModels.slice(0, 2).map((model, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {model}
                  </Badge>
                ))}
                {compatibleModels.length > 2 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs">
                          +{compatibleModels.length - 2} más
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          {compatibleModels.slice(2).join(", ")}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          )}
          
          {/* Price */}
          <div className="mt-4 flex items-end gap-2">
            {hasDiscount ? (
              <>
                <div className="text-xl font-bold text-primary">${formatPrice(discountPrice)}</div>
                <div className="text-sm text-muted-foreground line-through">${formatPrice(price)}</div>
              </>
            ) : (
              <div className="text-xl font-bold">${formatPrice(price)}</div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex gap-2 flex-1">
          <Button 
            className="flex-1 transition-all hover:shadow-md font-semibold min-h-[44px] text-sm sm:text-base"
            disabled={stock === 0}
            onClick={handleAddToCart}
            aria-label={stock === 0 ? `Producto agotado: ${name}` : `Agregar ${name} al carrito`}
          >
            {stock === 0 ? "Agotado" : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            asChild
            className="hover:scale-105 transition-transform min-w-[44px] min-h-[44px] flex-shrink-0"
            onClick={handleShare}
          >
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`Compartir ${name} por WhatsApp`}
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Compartir por WhatsApp</span>
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
