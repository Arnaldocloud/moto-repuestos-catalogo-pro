
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, categoryNames } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Car, Disc, Zap, Waves, Shield, Droplets, Filter, Link, CircleSlash, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CategoryIcon = ({ category }: { category: Category }) => {
  switch (category) {
    case "motor":
      return <Car className="h-5 w-5" />;
    case "frenos":
      return <Disc className="h-5 w-5" />;
    case "electricos":
      return <Zap className="h-5 w-5" />;
    case "suspension":
      return <Waves className="h-5 w-5" />;
    case "carroceria":
      return <Shield className="h-5 w-5" />;
    case "aceites":
      return <Droplets className="h-5 w-5" />;
    case "filtros":
      return <Filter className="h-5 w-5" />;
    case "transmision":
      return <Link className="h-5 w-5" />;
    case "llantas":
      return <CircleSlash className="h-5 w-5" />;
    case "accesorios":
      return <Wrench className="h-5 w-5" />;
    default:
      return null;
  }
};

const CategoriesAdmin: React.FC = () => {
  const { toast } = useToast();
  const categories = Object.keys(categoryNames) as Category[];

  // En una aplicación real, estas funciones se conectarían a una API
  const handleEditCategory = (category: Category) => {
    toast({
      title: "Edición de categoría",
      description: `La edición de categorías se implementaría conectándose a una API.`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-primary/10">
                  <CategoryIcon category={category} />
                </div>
                {categoryNames[category]}
              </CardTitle>
              <CardDescription>
                Categoría: {category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditCategory(category)}
                className="w-full"
              >
                Editar categoría
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="rounded-md border p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          Nota: En la versión actual, las categorías están definidas en <code>src/types/product.ts</code>. 
          Para añadir o modificar categorías, se necesitaría actualizar este archivo de tipos. 
          En una aplicación real con backend, las categorías se gestionarían a través de una API.
        </p>
      </div>
    </div>
  );
};

export default CategoriesAdmin;
