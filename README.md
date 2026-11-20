# VERA STUDIO — catálogo web

Sitio estático creado con HTML, CSS y JavaScript para publicar en GitHub Pages.

## Archivos
- `index.html`: estructura de la página.
- `styles.css`: diseño adaptable a celular y computador.
- `products.js`: catálogo editable de productos.
- `script.js`: filtros, búsqueda y enlaces personalizados de WhatsApp.
- `assets/`: fotografías de las prendas.

## Publicar en GitHub Pages
1. Crea un repositorio NUEVO llamado `vera-studio` (no reutilices el repositorio de Bienestar Contigo).
2. Sube el contenido de esta carpeta a la raíz del repositorio.
3. En GitHub abre Settings → Pages.
4. En Build and deployment selecciona Deploy from a branch.
5. Selecciona `main` y `/ (root)`, guarda.
6. Espera la publicación. El enlace tendrá una forma similar a `https://USUARIO.github.io/vera-studio/`.

## Actualizar productos
Edita `products.js`. Cada producto tiene `id`, `name`, `category`, `description` e `image`.
Las tallas, existencias y precios no se inventaron; se consultan por WhatsApp hasta que la tienda confirme esos datos.

## WhatsApp
El número está configurado en formato internacional de Colombia en `script.js` y en los enlaces del HTML.
