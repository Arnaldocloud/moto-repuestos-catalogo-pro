
import React, { useEffect, useState } from "react";
import { supabase, getSupabaseUrl, getSupabaseAuth } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader, CheckCircle, XCircle } from "lucide-react";

const SupabaseConnectionTest = () => {
  const [testResult, setTestResult] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
    details?: string;
  }>({
    status: "idle",
    message: "No se ha realizado la prueba de conexión",
  });

  const testConnection = async () => {
    setTestResult({
      status: "loading",
      message: "Probando conexión a Supabase...",
    });

    try {
      // Intentar obtener categorías como prueba básica
      const { data, error } = await supabase.from("categories").select("*").limit(1);

      if (error) throw error;

      console.log("Respuesta de Supabase:", data);

      setTestResult({
        status: "success",
        message: "Conexión exitosa a Supabase",
        details: `Se recibieron datos correctamente. Ejemplo: ${
          data.length > 0 ? JSON.stringify(data[0]) : "No hay datos"
        }`,
      });
    } catch (error) {
      console.error("Error al conectar con Supabase:", error);
      setTestResult({
        status: "error",
        message: "Error al conectar con Supabase",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  };

  // Probar conexión automáticamente al cargar
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Diagnóstico de Conexión a Supabase</h2>

      <Alert
        variant={
          testResult.status === "success"
            ? "default"
            : testResult.status === "error"
            ? "destructive"
            : "default"
        }
      >
        <div className="flex items-center gap-2">
          {testResult.status === "loading" && <Loader className="h-4 w-4 animate-spin" />}
          {testResult.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {testResult.status === "error" && <XCircle className="h-5 w-5" />}
          <AlertTitle>{testResult.message}</AlertTitle>
        </div>
        {testResult.details && <AlertDescription>{testResult.details}</AlertDescription>}
      </Alert>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          <strong>URL de Supabase:</strong> {getSupabaseUrl()}
        </div>
        <div className="text-sm text-muted-foreground">
          <strong>Estado de la clave:</strong> {getSupabaseAuth().getSession() ? "Presente" : "No disponible"}
        </div>
      </div>

      <Button onClick={testConnection} disabled={testResult.status === "loading"}>
        {testResult.status === "loading" && <Loader className="mr-2 h-4 w-4 animate-spin" />}
        Probar conexión de nuevo
      </Button>
    </div>
  );
};

export default SupabaseConnectionTest;
