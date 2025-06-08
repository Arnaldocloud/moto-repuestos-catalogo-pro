
import React from "react";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Share2, Eye, Tag, ShoppingCart, Star } from "lucide-react";
import { createWhatsAppLink, createProductQuery } from "@/config/contact";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

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
  
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href + `?product=${sku}`);
    toast.success("Enlace copiado al portapapeles", {
      description: "Ahora puedes compartirlo con quien quieras",
      duration: 3000,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Agregando producto al carrito:", product);
    addItem(product, 1);
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="group relative h-full overflow-hidden border border-border bg-card shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]">
      <CardContent className="p-0 relative">
        {/* Badges Container */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg animate-pulse">
              ✨ NUEVO
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg animate-bounce">
              -{discountPercentage}% OFF
            </Badge>
          )}
          {stock !== undefined && stock <= 5 && stock > 0 && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 font-semibold shadow-sm dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700">
              ⚡ Últimas {stock}
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 font-semibold shadow-sm dark:bg-red-900/20 dark:text-red-300 dark:border-red-700">
              ❌ Agotado
            </Badge>
          )}
        </div>
        
        {/* SKU Badge */}
        <div className="absolute top-3 right-3 z-20">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-background/90 backdrop-blur-sm border-border/50 shadow-sm">
                  <Tag className="h-3 w-3 mr-1" /> 
                  {sku}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Código SKU del producto</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <img 
            src={images && images.length > 0 ? images[0] : '/placeholder.svg'} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            width="400"
            height="400"
          />
          
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/95 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm scale-0 group-hover:scale-100 transition-all duration-300 font-medium"
              onClick={() => onQuickView(product)}
              aria-label={`Vista rápida de ${name}`}
            >
              <Eye className="h-4 w-4 mr-2" />
              Vista Rápida
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {brand}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">4.5</span>
            </div>
          </div>
          
          {/* Product Name */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 min-h-[3.5rem] text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          
          {/* Compatible models */}
          {compatibleModels && compatibleModels.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Compatible con:</p>
              <div className="flex flex-wrap gap-1">
                {compatibleModels.slice(0, 2).map((model, index) => (
                  <Badge key={index} variant="outline" className="text-xs py-0.5 px-2 bg-primary/5 text-primary border-primary/20">
                    {model}
                  </Badge>
                ))}
                {compatibleModels.length > 2 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs py-0.5 px-2 bg-secondary text-secondary-foreground cursor-help">
                          +{compatibleModels.length - 2} más
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <div className="text-xs space-y-1">
                          <p className="font-medium">Modelos compatibles:</p>
                          <p>{compatibleModels.slice(2).join(", ")}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          )}
          
          {/* Price Section */}
          <div className="flex items-end justify-between pt-2">
            <div className="space-y-1">
              {hasDiscount ? (
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">
                    ${formatPrice(discountPrice)}
                  </div>
                  <div className="text-sm text-muted-foreground line-through">
                    ${formatPrice(price)}
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-foreground">
                  ${formatPrice(price)}
                </div>
              )}
            </div>
            
            {/* Stock indicator */}
            {stock !== undefined && stock > 0 && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Stock</div>
                <div className={`text-sm font-medium ${stock <= 5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                  {stock} unidades
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex gap-3">
        <Button 
          className="flex-1 h-11 font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          disabled={stock === 0}
          onClick={handleAddToCart}
          aria-label={stock === 0 ? `Producto agotado: ${name}` : `Agregar ${name} al carrito`}
        >
          {stock === 0 ? (
            "Sin Stock"
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar al Carrito
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-11 w-11 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          onClick={handleWhatsAppShare}
          aria-label={`Compartir ${name} por WhatsApp`}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
