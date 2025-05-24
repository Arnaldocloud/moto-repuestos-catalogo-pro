
export const STORE_NAME = "MotoRepuestos Pro";

export const CONTACT_INFO = {
  phone: "+584121234567",
  email: "info@motorepuestospro.com",
  address: "Av. Principal, Centro Comercial Plaza, Local 15",
  city: "Caracas, Venezuela",
  whatsapp: "+584121234567",
  instagram: "@motorepuestospro",
  facebook: "motorepuestospro",
  
  // Horarios
  schedule: {
    weekdays: "Lunes a Viernes: 8:00 AM - 6:00 PM",
    saturday: "Sábados: 8:00 AM - 4:00 PM",
    sunday: "Domingos: Cerrado"
  },

  // Información del negocio
  businessInfo: {
    established: "2014",
    experience: "Más de 10 años",
    coverage: "Todo Venezuela",
    warranty: "Garantía en todos los productos"
  }
};

// Utility functions for WhatsApp integration
export const createWhatsAppLink = (message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}?text=${encodedMessage}`;
};

export const createProductQuery = (productName: string, sku: string): string => {
  return `Hola! Estoy interesado en el producto: ${productName} (SKU: ${sku}). ¿Podrían darme más información sobre disponibilidad y precio?`;
};

export const createSpecialOrderMessage = (
  productName: string,
  details: string,
  customerName: string,
  customerPhone: string,
  budget?: string
): string => {
  let message = `🔧 SOLICITUD DE REPUESTO ESPECIAL\n\n`;
  message += `👤 Cliente: ${customerName}\n`;
  message += `📱 Teléfono: ${customerPhone}\n\n`;
  message += `🔍 Producto solicitado: ${productName}\n\n`;
  message += `📋 Detalles:\n${details}\n\n`;
  
  if (budget) {
    message += `💰 Presupuesto: ${budget}\n\n`;
  }
  
  message += `¡Gracias por contactarnos! Te responderemos pronto con información sobre disponibilidad y precio.`;
  
  return message;
};
