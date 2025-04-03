
import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: "1",
    name: "Kit de Pistón Completo",
    sku: "MOT-KP-150",
    price: 89.99,
    discountPrice: 79.99,
    brand: "Wiseco",
    category: "motor",
    compatibleModels: ["Honda CG 150", "Honda Titan 150", "Honda CBR 150"],
    description: "Kit completo de pistón para motores 150cc. Incluye pistón, anillos, pasador y seguros.",
    features: [
      "Diámetro: 57.3mm",
      "Material: Aluminio forjado de alta resistencia",
      "Incluye anillos de compresión y aceite",
      "Compatible con motores Honda 150cc",
      "Garantía de 6 meses"
    ],
    images: [
      "https://m.media-amazon.com/images/I/711AUcaSEdL._AC_UF894,1000_QL80_.jpg",
    ],
    stock: 15,
    isNew: true
  },
  {
    id: "2",
    name: "Pastillas de Freno Delanteras",
    sku: "FRE-PD-001",
    price: 29.99,
    brand: "Brembo",
    category: "frenos",
    compatibleModels: ["Yamaha YBR 125", "Honda CB 190", "Suzuki GN 125"],
    description: "Pastillas de freno de alto rendimiento para discos delanteros. Excelente frenado en condiciones secas y húmedas.",
    features: [
      "Material: Compuesto semi-metálico",
      "Buena disipación de calor",
      "Bajo nivel de ruido",
      "Resistentes al desgaste",
      "Instalación directa"
    ],
    images: [
      "https://m.media-amazon.com/images/I/916j1egbUFL.jpg"
    ],
    stock: 30
  },
  {
    id: "3",
    name: "Kit de Carburador",
    sku: "MOT-KC-125",
    price: 65.50,
    discountPrice: 59.99,
    brand: "Mikuni",
    category: "motor",
    compatibleModels: ["Honda CG 125", "Yamaha YBR 125", "Suzuki EN 125"],
    description: "Kit completo de carburador para motos 125cc. Mejora el rendimiento y la respuesta del acelerador.",
    features: [
      "Diámetro de admisión: 26mm",
      "Incluye juntas y flotador",
      "Ajuste preciso de la mezcla aire/combustible",
      "Fácil instalación",
      "Compatible con diferentes marcas"
    ],
    images: [
      "https://m.media-amazon.com/images/I/71ik28eLVIL._AC_UF894,1000_QL80_.jpg"
    ],
    stock: 8
  },
  {
    id: "4",
    name: "Batería Sellada 12V",
    sku: "ELE-BS-12V",
    price: 45.99,
    brand: "Yuasa",
    category: "electricos",
    compatibleModels: ["Todas las marcas"],
    description: "Batería sellada de 12V para motocicletas. Libre de mantenimiento y con larga vida útil.",
    features: [
      "Voltaje: 12V",
      "Capacidad: 7Ah",
      "Tecnología AGM (Absorbed Glass Mat)",
      "Libre de mantenimiento",
      "Resistente a vibraciones"
    ],
    images: [
      "https://m.media-amazon.com/images/I/81xyAzf76WL._AC_UF894,1000_QL80_.jpg"
    ],
    stock: 20,
    isNew: true
  },
  {
    id: "5",
    name: "Amortiguadores Traseros",
    sku: "SUS-AT-001",
    price: 120.00,
    discountPrice: 99.99,
    brand: "YSS",
    category: "suspension",
    compatibleModels: ["Honda CG 150", "Yamaha FZ 150", "Suzuki GSX 150"],
    description: "Par de amortiguadores traseros con regulación de precarga. Mejoran la estabilidad y el confort.",
    features: [
      "Longitud: 340mm",
      "Regulación de precarga en 5 posiciones",
      "Acabado en negro con resorte rojo",
      "Venta por par",
      "Incluye accesorios de montaje"
    ],
    images: [
      "https://m.media-amazon.com/images/I/51mC8xvuDHL.jpg",
    ],
    stock: 5
  },
  {
    id: "6",
    name: "Aceite Motor 4T 20W-50",
    sku: "ACE-4T-001",
    price: 18.50,
    brand: "Motul",
    category: "aceites",
    compatibleModels: ["Todas las marcas"],
    description: "Aceite de motor 4 tiempos de alta calidad. Proporciona excelente lubricación y protección contra el desgaste.",
    features: [
      "Viscosidad: 20W-50",
      "Contenido: 1 litro",
      "Para motores 4 tiempos",
      "Formulación semi-sintética",
      "Protección contra el desgaste y la corrosión"
    ],
    images: [
      "https://images.unsplash.com/photo-1567606828681-5d8c32a3dbf0?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1636901942318-972ea62b4d5d?q=80&w=1936&auto=format&fit=crop"
    ],
    stock: 50
  },
  {
    id: "7",
    name: "Kit de Cadena y Piñones",
    sku: "TRA-KC-428",
    price: 55.00,
    brand: "DID",
    category: "transmision",
    compatibleModels: ["Honda CG 125", "Yamaha YBR 125", "Suzuki EN 125"],
    description: "Kit completo de transmisión. Incluye cadena, piñón y corona para motos 125cc.",
    features: [
      "Cadena: 428H con 118 eslabones",
      "Piñón: 14 dientes",
      "Corona: 38 dientes",
      "Material: Acero tratado térmicamente",
      "Mayor durabilidad que los componentes originales"
    ],
    images: [
      "https://images.unsplash.com/photo-1580457954131-abbade05f189?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600197992818-f5ea5c2e358e?q=80&w=1942&auto=format&fit=crop"
    ],
    stock: 12
  },
  {
    id: "8",
    name: "Carenado Lateral Derecho",
    sku: "CAR-CL-R15",
    price: 85.99,
    brand: "Yamaha Original",
    category: "carroceria",
    compatibleModels: ["Yamaha R15"],
    description: "Carenado lateral derecho original para Yamaha R15. Color azul con calcomanías de fábrica.",
    features: [
      "Material: ABS de alta calidad",
      "Color: Azul Yamaha Racing",
      "Incluye calcomanías originales",
      "Pieza original de fábrica",
      "Resistente a impactos y radiación UV"
    ],
    images: [
      "https://images.unsplash.com/photo-1541802645635-11f2286a7482?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563040666-e7802002663c?q=80&w=2069&auto=format&fit=crop"
    ],
    stock: 3,
    isNew: true
  },
  {
    id: "9",
    name: "Llantas Deportivas 110/70-17",
    sku: "LLA-PD-17",
    price: 79.99,
    brand: "Pirelli",
    category: "llantas",
    compatibleModels: ["Honda CBR 250", "Yamaha R15", "Suzuki Gixxer"],
    description: "Llanta deportiva para uso en calle y circuito. Excelente agarre en superficies secas y mojadas.",
    features: [
      "Medida: 110/70-17",
      "Posición: Delantera",
      "Índice de carga: 54",
      "Índice de velocidad: H (hasta 210 km/h)",
      "Patrón de banda de rodadura deportivo"
    ],
    images: [
      "https://images.unsplash.com/photo-1628929349379-a1de36f22d01?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600678786524-d9f06954b417?q=80&w=1935&auto=format&fit=crop"
    ],
    stock: 8
  },
  {
    id: "10",
    name: "Manillar Deportivo Universal",
    sku: "ACC-MD-001",
    price: 38.50,
    discountPrice: 32.99,
    brand: "Renthal",
    category: "accesorios",
    compatibleModels: ["Adaptable a varias motos"],
    description: "Manillar deportivo de perfil bajo. Mejora la posición de conducción y el control de la moto.",
    features: [
      "Material: Aluminio 7075",
      "Diámetro: 22mm estándar",
      "Largo: 760mm",
      "Altura: 85mm",
      "Color: Negro anodizado con detalles dorados"
    ],
    images: [
      "https://images.unsplash.com/photo-1575395311793-e76c1997383c?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop"
    ],
    stock: 15
  },
  {
    id: "11",
    name: "Filtro de Aire Alto Flujo",
    sku: "FIL-FA-K&N",
    price: 42.99,
    brand: "K&N",
    category: "filtros",
    compatibleModels: ["Honda Tornado 250", "Honda XR 250", "Honda CRF 250"],
    description: "Filtro de aire lavable de alto flujo. Mejora la respiración del motor y el rendimiento.",
    features: [
      "Elemento filtrante de algodón especial",
      "Marco de goma resistente",
      "Lavable y reutilizable",
      "Mayor flujo de aire que el filtro original",
      "Kit de mantenimiento disponible por separado"
    ],
    images: [
      "https://images.unsplash.com/photo-1607603750909-408f193a2ed7?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613255597665-9ce95800dfa9?q=80&w=1935&auto=format&fit=crop"
    ],
    stock: 10,
    isNew: true
  },
  {
    id: "12",
    name: "Bujía Iridium Power",
    sku: "ELE-BI-001",
    price: 15.99,
    brand: "NGK",
    category: "electricos",
    compatibleModels: ["Compatible con múltiples modelos"],
    description: "Bujía de alto rendimiento con punta de iridio. Mejora el encendido y la combustión del motor.",
    features: [
      "Punta de electrodo central de iridio",
      "Mayor durabilidad que las bujías convencionales",
      "Mejor encendido a bajas temperaturas",
      "Reduce el consumo de combustible",
      "Instalación estándar"
    ],
    images: [
      "https://images.unsplash.com/photo-1586323389003-64bc23b44f79?q=80&w=2035&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590422294051-3274a4675342?q=80&w=1978&auto=format&fit=crop"
    ],
    stock: 25
  }
];

export const getProductsByCategory = (category: string) => {
  if (category === 'todos') return products;
  return products.filter(product => product.category === category);
};

export const searchProducts = (query: string) => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return products;
  
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.sku.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.compatibleModels.some(model => model.toLowerCase().includes(searchTerm))
  );
};
