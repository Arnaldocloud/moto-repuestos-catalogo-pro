
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
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a0.5.0.5 0 0 0 1 0V9a0.5.0.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a0.5.0.5 0 0 0 0-1h-1a0.5.0.5 0 0 0 0 1" />
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
