
import { Helmet } from "react-helmet-async";
import { STORE_NAME } from "@/config/contact";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = `${STORE_NAME} - Repuestos de Motos de Calidad`,
  description = "Encuentra los mejores repuestos para tu moto con calidad garantizada y envíos a todo Venezuela. Motor, frenos, eléctricos, suspensión y más.",
  keywords = "repuestos motos Venezuela, repuestos motocicletas, motor moto, frenos moto, aceites moto, filtros moto",
  image = "/images/motorcycle-poster.jpg",
  url = "https://tu-dominio.com"
}) => {
  const fullTitle = title.includes(STORE_NAME) ? title : `${title} | ${STORE_NAME}`;

  return (
    <Helmet>
      {/* Título y descripción básica */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph para redes sociales */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Datos estructurados para Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": STORE_NAME,
          "description": description,
          "url": url,
          "telephone": "+584121234567",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Av. Principal, Centro Comercial Plaza, Local 15",
            "addressLocality": "Caracas",
            "addressCountry": "VE"
          },
          "sameAs": [
            "https://www.instagram.com/motorepuestospro",
            "https://www.facebook.com/motorepuestospro"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
