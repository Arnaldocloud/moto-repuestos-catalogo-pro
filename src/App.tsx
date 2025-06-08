import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import FaviconUpdater from "@/components/FaviconUpdater";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <TooltipProvider>
              <Helmet>
                <title>Moto Repuestos - Repuestos y Accesorios para Motocicletas</title>
                <meta name="description" content="Encuentra los mejores repuestos y accesorios para tu motocicleta. Calidad garantizada y precios competitivos." />
                <link rel="icon" type="image/png" href="/favicon.png" sizes="512x512" />
                <link rel="shortcut icon" href="/favicon.png" />
              </Helmet>
              <FaviconUpdater />
              <BrowserRouter>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/categorias" element={<Categories />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
