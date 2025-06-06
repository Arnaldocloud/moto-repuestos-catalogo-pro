
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Testing Supabase connection...");
        const { data, error } = await supabase.from("products").select("count").limit(1);
        
        if (error) {
          console.error("Connection test failed:", error);
          setIsConnected(false);
        } else {
          console.log("Connection test successful");
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Connection test error:", error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <div className="animate-spin h-3 w-3 border border-gray-300 border-t-transparent rounded-full"></div>
        Verificando conexión...
      </Badge>
    );
  }

  return (
    <Badge 
      variant={isConnected ? "default" : "destructive"} 
      className="flex items-center gap-1"
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          Conectado a Supabase
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Sin conexión a Supabase
        </>
      )}
    </Badge>
  );
};

export default ConnectionStatus;
