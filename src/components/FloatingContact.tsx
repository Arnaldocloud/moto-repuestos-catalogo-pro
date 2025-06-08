
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createWhatsAppLink } from "@/config/contact";

const FloatingContact: React.FC = () => {
  const generalWhatsAppLink = createWhatsAppLink(
    "Hola, estoy viendo su catálogo de repuestos y me gustaría recibir más información."
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600 text-white shadow-lg animate-pulse-scale"
              asChild
            >
              <a
                href={generalWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp"
              >
                <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="w-6 h-6"
>
  
  <path d="M3 21 L3.65 17.2 A9 9 0 1 1 7.05 20.1 L3 21" />
  
  
  <path d="M9 10 A0.5 0.5 0 0 0 10 10 V9 A0.5 0.5 0 0 0 9 9 V10 A5 5 0 0 0 14 15 H15 A0.5 0.5 0 0 0 15 14 H14 A0.5 0.5 0 0 0 14 15" />
</svg>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="mr-2">
            <p>Contactar por WhatsApp</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingContact;
