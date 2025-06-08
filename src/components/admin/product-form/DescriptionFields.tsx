
import React from "react";
import { Control } from "react-hook-form";
import { ProductFormValues } from "./schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "./ImageUploader";

interface DescriptionFieldsProps {
  control: Control<ProductFormValues>;
}

const DescriptionFields: React.FC<DescriptionFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imágenes del producto</FormLabel>
            <FormControl>
              <ImageUploader
                images={field.value ? field.value.split('\n').filter(url => url.trim() !== '') : []}
                onChange={(images) => {
                  field.onChange(images.join('\n'));
                }}
              />
            </FormControl>
            <FormDescription>
              Sube imágenes directamente o usa la cámara para tomar fotos del producto
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default DescriptionFields;
