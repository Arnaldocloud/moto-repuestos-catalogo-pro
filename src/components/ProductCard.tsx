
import React from "react";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Share2, Eye, Tag } from "lucide-react";
import { createWhatsAppLink, createProductQuery } from "@/config/contact";

// Helper function to safely format prices
const formatPrice = (price: number | undefined | null): string => {
  if (price === null || price === undefined) {
    return "N/A";
  }
  return price.toFixed(2);
};

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { name, price, discountPrice, brand, sku, images, isNew, stock, compatibleModels } = product;
  
  // Ensure price values are safe to use
  const safePrice = price || 0;
  const safeDiscountPrice = discountPrice || null;
  
  const hasDiscount = safeDiscountPrice !== null && safeDiscountPrice < safePrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((safePrice - safeDiscountPrice!) / safePrice) * 100) 
    : 0;

  const whatsappLink = createWhatsAppLink(createProductQuery(name, sku));

  return (
    <Card className="h-full product-card-hover overflow-hidden">
      <CardContent className="p-0 relative">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-blue-500 hover:bg-blue-600">NUEVO</Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-primary hover:bg-primary/90">-{discountPercentage}%</Badge>
          )}
          {stock <= 5 && stock > 0 && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500 hover:bg-yellow-500/20">
              ¡Últimas unidades!
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500 hover:bg-red-500/20">
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
                  <Tag className="h-3 w-3 mr-1" /> {sku}
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
          />
          
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 opacity-0 hover:opacity-100 flex items-center justify-center">
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white hover:bg-white/90 text-gray-800"
              onClick={() => onQuickView(product)}
            >
              <Eye className="h-4 w-4 mr-2" />
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
                <div className="text-xl font-bold text-primary">${formatPrice(safeDiscountPrice)}</div>
                <div className="text-sm text-muted-foreground line-through">${formatPrice(safePrice)}</div>
              </>
            ) : (
              <div className="text-xl font-bold">${formatPrice(safePrice)}</div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button 
          className="w-full"
          disabled={stock === 0}
        >
          {stock === 0 ? "Agotado" : "Consultar"}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          asChild
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Share2 className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
