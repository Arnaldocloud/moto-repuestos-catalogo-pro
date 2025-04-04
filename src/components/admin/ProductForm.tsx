import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product, Category, categoryNames } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Convertir las claves del objeto categoryNames a un array
const categoryOptions = Object.keys(categoryNames) as Category[];

// Define the form schema with proper transformations
const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  sku: z.string().min(3, { message: "El SKU debe tener al menos 3 caracteres" }),
  price: z.coerce.number().min(0, { message: "El precio debe ser mayor o igual a 0" }),
  discountPrice: z.coerce.number().min(0, { message: "El precio con descuento debe ser mayor o igual a 0" }).optional(),
  brand: z.string().min(1, { message: "La marca es requerida" }),
  category: z.enum([
    "motor", "frenos", "electricos", "suspension", "carroceria", 
    "aceites", "filtros", "transmision", "llantas", "accesorios"
  ]),
  compatibleModels: z.string().transform(str => str.split(',').map(s => s.trim())),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  features: z.string().transform(str => str.split('\n').filter(s => s.trim().length > 0)),
  images: z.string().transform(str => str.split(',').map(s => s.trim())),
  stock: z.coerce.number().int().min(0, { message: "El stock debe ser un número entero positivo" }),
  isNew: z.boolean().optional(),
  isSpecialOrder: z.boolean().optional(),
});

// Infer the form values type from the schema
type ProductFormValues = z.infer<typeof productSchema>;

// Definir un tipo para los valores por defecto del formulario
type ProductFormDefaults = {
  id?: string;
  name: string;
  sku: string;
  price: number;
  discountPrice?: number;
  brand: string;
  category: Category;
  compatibleModels: string; // String para el input
  description: string;
  features: string; // String para el input
  images: string; // String para el input
  stock: number;
  isNew: boolean;
  isSpecialOrder: boolean;
};

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  // Prepare initialValues correctly
  const getDefaultValues = (): ProductFormDefaults => {
    if (!initialData) {
      return {
        name: "",
        sku: "",
        price: 0,
        brand: "",
        category: "motor" as Category,
        compatibleModels: "", // String for input
        description: "",
        features: "", // String for input
        images: "", // String for input
        stock: 0,
        isNew: false,
        isSpecialOrder: false,
      };
    }

    return {
      ...initialData,
      compatibleModels: Array.isArray(initialData.compatibleModels) 
        ? initialData.compatibleModels.join(", ")
        : "",
      features: Array.isArray(initialData.features) 
        ? initialData.features.join("\n") 
        : "",
      images: Array.isArray(initialData.images) 
        ? initialData.images.join(", ") 
        : "",
      isNew: initialData.isNew || false,
      isSpecialOrder: initialData.isSpecialOrder || false,
    };
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues() as any, // Usamos 'as any' para evitar problemas de tipado
  });

  const handleSubmit = (values: ProductFormValues) => {
    // Ensure proper transformation for onSubmit handler
    const productData: Product = {
      id: values.id || String(Date.now()),
      name: values.name,
      sku: values.sku,
      price: values.price,
      discountPrice: values.discountPrice,
      brand: values.brand,
      category: values.category,
      compatibleModels: Array.isArray(values.compatibleModels) 
        ? values.compatibleModels 
        : [],
      description: values.description,
      features: Array.isArray(values.features) 
        ? values.features 
        : [],
      images: Array.isArray(values.images) 
        ? values.images 
        : [],
      stock: values.stock,
      isNew: values.isNew,
      isSpecialOrder: values.isSpecialOrder,
    };
    
    onSubmit(productData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del producto</FormLabel>
                <FormControl>
                  <Input placeholder="Kit de Pistón Completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="MOT-KP-150" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio con descuento (opcional)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Wiseco" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {categoryNames[category]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe el producto en detalle..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="compatibleModels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelos compatibles</FormLabel>
              <FormControl>
                <Input
                  placeholder="Honda CG 150, Honda Titan 150, Honda CBR 150"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Separa los modelos con comas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Características</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Diámetro: 57.3mm
Material: Aluminio forjado de alta resistencia
Incluye anillos de compresión y aceite"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Escribe cada característica en una nueva línea
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URLs de imágenes</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Separa las URLs con comas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Marcar como nuevo</FormLabel>
                  <FormDescription>
                    Muestra una etiqueta de "Nuevo" en el producto
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isSpecialOrder"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Pedido especial</FormLabel>
                  <FormDescription>
                    Indica que este producto es por pedido especial
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit">
            {initialData ? "Actualizar Producto" : "Crear Producto"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
