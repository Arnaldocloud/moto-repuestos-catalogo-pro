
import React from "react";
import { Control } from "react-hook-form";
import { ProductFormValues } from "./schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";

interface FlagsFieldsProps {
  control: Control<ProductFormValues>;
}

const FlagsFields: React.FC<FlagsFieldsProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
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
        control={control}
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
  );
};

export default FlagsFields;
