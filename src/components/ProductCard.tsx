
import React from "react";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Share2, Eye, Tag, ShoppingCart, Heart } from "lucide-react";
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
    <Card className="group h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 hover:border-primary/20">
      <CardContent className="p-0 relative">
        {/* Badges Container */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs px-2 py-1 shadow-md">
              NUEVO
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-xs px-2 py-1 shadow-md animate-pulse">
              -{discountPercentage}%
            </Badge>
          )}
          {stock !== undefined && stock <= 5 && stock > 0 && (
            <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700 font-medium text-xs">
              ¡Últimas {stock}!
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 font-medium text-xs">
              Agotado
            </Badge>
          )}
        </div>
        
        {/* SKU y Favorito */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-background/90 dark:bg-background/90 backdrop-blur-sm text-xs font-mono">
                  <Tag className="h-3 w-3 mr-1" /> {sku}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Código SKU</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-background/90 dark:bg-background/90 backdrop-blur-sm border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <img 
            src={images && images.length > 0 ? images[0] : '/placeholder.svg'} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            width="400"
            height="400"
          />
          
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          
          {/* Quick view button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/95 dark:bg-white/95 hover:bg-white text-gray-900 shadow-lg backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
              onClick={() => onQuickView(product)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Vista rápida
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Brand */}
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {brand}
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
                  <Badge key={index} variant="outline" className="text-xs bg-muted/50 hover:bg-muted">
                    {model}
                  </Badge>
                ))}
                {compatibleModels.length > 2 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs bg-muted/50 hover:bg-muted cursor-help">
                          +{compatibleModels.length - 2} más
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs max-w-48">
                          {compatibleModels.slice(2).join(", ")}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          )}
          
          {/* Stock indicator */}
          {stock !== undefined && stock > 0 && (
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${stock > 10 ? 'bg-green-500' : stock > 5 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-xs text-muted-foreground">
                {stock > 10 ? 'En stock' : `Solo ${stock} disponibles`}
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-end gap-2 pt-2">
            {hasDiscount ? (
              <>
                <div className="text-2xl font-bold text-primary">
                  ${formatPrice(discountPrice)}
                </div>
                <div className="text-lg text-muted-foreground line-through">
                  ${formatPrice(price)}
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold text-foreground">
                ${formatPrice(price)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          className="flex-1 font-medium transition-all duration-300 hover:shadow-md disabled:opacity-50"
          disabled={stock === 0}
          onClick={handleAddToCart}
        >
          {stock === 0 ? "Agotado" : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar al carrito
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          asChild
          className="transition-all duration-300 hover:scale-105 hover:shadow-md"
          onClick={handleShare}
        >
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Share2 className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
