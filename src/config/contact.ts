
// Configura tu información de contacto aquí
export const WHATSAPP_NUMBER = "5491112345678"; // Reemplaza con tu número (formato internacional)
export const STORE_NAME = "Moto Repuestos Pro";

// Función para crear enlaces de WhatsApp
export const createWhatsAppLink = (message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

// Plantillas de mensajes
export const createProductQuery = (product: string, sku: string): string => {
  return `Hola ${STORE_NAME}, estoy interesado en el producto: *${product}* (SKU: ${sku}). ¿Podrían darme más información sobre disponibilidad y precio?`;
};

export const createSpecialOrderMessage = (
  productName: string,
  details: string,
  name: string,
  phone: string,
  budget?: string
): string => {
  let message = `🏍️ *SOLICITUD DE PEDIDO ESPECIAL* 🏍️\n\n`;
  message += `👤 *Cliente:* ${name}\n`;
  message += `📱 *Teléfono:* ${phone}\n\n`;
  message += `🔍 *Producto solicitado:* ${productName}\n\n`;
  message += `📝 *Detalles:* ${details}\n\n`;
  
  if (budget) {
    message += `💰 *Presupuesto aproximado:* ${budget}\n\n`;
  }
  
  message += `Gracias por contactar a ${STORE_NAME}. Revisaremos su solicitud y le responderemos a la brevedad.`;
  
  return message;
};
