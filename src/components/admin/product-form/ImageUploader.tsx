
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Función para subir una imagen a Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `product_images/${fileName}`;

      setIsUploading(true);

      // Subir el archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obtener la URL pública del archivo
      const { data: publicURL } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return publicURL.publicUrl;
    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      toast({
        title: "Error al subir imagen",
        description: error.message || "Ha ocurrido un error al subir la imagen",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Manejar subida desde el dispositivo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = [...images];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i]);
      if (url) newImages.push(url);
    }

    onChange(newImages);
    // Reset input value to allow uploading the same file again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Iniciar la cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err: any) {
      console.error('Error al acceder a la cámara:', err);
      toast({
        title: "Error de cámara",
        description: "No se pudo acceder a la cámara. Asegúrate de dar permiso.",
        variant: "destructive",
      });
    }
  };

  // Detener la cámara
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  // Capturar imagen de la cámara
  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convertir a blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else toast({
              title: "Error",
              description: "No se pudo capturar la imagen",
              variant: "destructive",
            });
          }, 'image/jpeg');
        });
        
        // Convertir blob a File
        const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        // Subir imagen
        const url = await uploadImage(file);
        if (url) {
          onChange([...images, url]);
        }

        // Cerrar la cámara después de capturar
        stopCamera();
      }
    }
  };

  // Eliminar imagen
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      {/* Visualización de imágenes actuales */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
              <img src={image} alt={`Producto ${index + 1}`} className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Entrada de archivo oculta */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Botones para cargar imagen o usar cámara */}
      <div className="flex flex-wrap gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" /> 
          {isUploading ? "Subiendo..." : "Cargar imágenes"}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={showCamera ? stopCamera : startCamera}
        >
          <Camera className="mr-2 h-4 w-4" /> 
          {showCamera ? "Cerrar cámara" : "Usar cámara"}
        </Button>
      </div>

      {/* Interfaz de la cámara */}
      {showCamera && (
        <div className="mt-3 border rounded-md p-2">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full rounded-md"
          />
          <canvas ref={canvasRef} className="hidden" />
          <Button 
            type="button" 
            onClick={captureImage}
            className="mt-2 w-full"
          >
            Capturar imagen
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
