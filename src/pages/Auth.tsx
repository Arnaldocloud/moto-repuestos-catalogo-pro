import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // Verificar si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Limpiar cualquier estado de autenticación anterior
      cleanupAuthState();
      
      // Cerrar sesión globalmente primero para evitar conflictos
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuar aunque falle
      }
      
      // Intentar iniciar sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success("Inicio de sesión exitoso");
      
      // Forzar recarga completa para asegurar estado limpio
      window.location.href = "/admin";
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Limpiar cualquier estado de autenticación anterior
      cleanupAuthState();
      
      // Cerrar sesión globalmente primero para evitar conflictos
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuar aunque falle
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success("Registro exitoso. Revisa tu correo para confirmar tu cuenta.");
      setActiveTab("login");
    } catch (error: any) {
      console.error("Error al registrarse:", error);
      toast.error(error.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Autenticación</CardTitle>
          <CardDescription>Inicia sesión o crea una cuenta para continuar.</CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="signup">Registrarse</TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-6">
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Cargando..." : "Iniciar sesión"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="signup-email">Correo electrónico</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Cargando..." : "Registrarse"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex flex-col">
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Al iniciar sesión o registrarte, aceptas nuestros términos y condiciones.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
