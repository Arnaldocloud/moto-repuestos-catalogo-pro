
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { productSchema, ProductFormValues } from "./schema";
import { getDefaultValues, transformFormToProduct } from "./utils";
import BasicInfoFields from "./BasicInfoFields";
import PricingStockFields from "./PricingStockFields";
import DescriptionFields from "./DescriptionFields";
import FlagsFields from "./FlagsFields";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  // By explicitly typing the defaultValues as ProductFormValues, we ensure compatibility
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(initialData) as unknown as ProductFormValues,
  });

  const handleSubmit = (values: ProductFormValues) => {
    // Transform the form data to a Product object
    const productData = transformFormToProduct(values);
    onSubmit(productData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields control={form.control} />
        <PricingStockFields control={form.control} />
        <DescriptionFields control={form.control} />
        <FlagsFields control={form.control} />

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
