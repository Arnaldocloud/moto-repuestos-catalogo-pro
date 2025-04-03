
import React from "react";
import { Category, categoryNames } from "@/types/product";
import { Button } from "@/components/ui/button";
import { 
  Engine, 
  Disc, 
  Zap, 
  Waves, 
  Bookmark, 
  Droplets, 
  Filter, 
  Link,
  CircleDot,
  Wrench
} from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Mapa de iconos por categoría
const categoryIcons = {
  todos: <Wrench className="h-4 w-4 mr-2" />,
  motor: <Engine className="h-4 w-4 mr-2" />,
  frenos: <Disc className="h-4 w-4 mr-2" />,
  electricos: <Zap className="h-4 w-4 mr-2" />,
  suspension: <Waves className="h-4 w-4 mr-2" />,
  carroceria: <Bookmark className="h-4 w-4 mr-2" />,
  aceites: <Droplets className="h-4 w-4 mr-2" />,
  filtros: <Filter className="h-4 w-4 mr-2" />,
  transmision: <Link className="h-4 w-4 mr-2" />,
  llantas: <CircleDot className="h-4 w-4 mr-2" />,
  accesorios: <Wrench className="h-4 w-4 mr-2" />
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-col space-y-2 p-4">
      <h2 className="text-lg font-semibold mb-2">Categorías</h2>
      
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-col md:space-y-1">
        <Button
          variant={selectedCategory === "todos" ? "default" : "ghost"}
          className="justify-start"
          onClick={() => onSelectCategory("todos")}
        >
          {categoryIcons.todos}
          Todos
        </Button>
        
        {(Object.keys(categoryNames) as Category[]).map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "ghost"}
            className="justify-start"
            onClick={() => onSelectCategory(category)}
          >
            {categoryIcons[category as keyof typeof categoryIcons]}
            {categoryNames[category]}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
