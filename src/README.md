
# Catálogo de Repuestos de Motos

Este proyecto es un catálogo de repuestos de motos que utiliza:

- React con TypeScript
- TailwindCSS para el diseño
- Shadcn UI para componentes
- Supabase como backend
- React Query para gestión de estado y datos

## Solución de problemas de conexión con Supabase

Si experimentas problemas con la conexión a Supabase:

1. Verifica que la aplicación esté publicada correctamente
2. Usa el botón "Diagnóstico" en la página principal para verificar la conexión
3. Asegúrate de que las claves de Supabase sean correctas en `src/integrations/supabase/client.ts`
4. Revisa los permisos de RLS (Row Level Security) en las tablas de Supabase
5. Verifica que los datos existan en las tablas

## Estructura del proyecto

- `/src/components`: Componentes reutilizables
- `/src/hooks`: Hooks personalizados, incluido `useProducts` para React Query
- `/src/services`: Servicios para comunicación con Supabase
- `/src/pages`: Páginas principales de la aplicación
- `/src/types`: Definiciones de tipos TypeScript
- `/src/integrations/supabase`: Configuración y tipos de Supabase

## Desarrollo

1. La aplicación utiliza Supabase como backend
2. Los productos y categorías se almacenan en tablas de Supabase
3. El panel de administración permite gestionar productos

## Desarrollo futuro

- Implementar autenticación para el panel de administrador
- Mejorar el sistema de filtrado y búsqueda
- Agregar más funcionalidades al panel de administración
