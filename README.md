# 📝 Mi primer blog - Una web de Reseñas

En este proyecto intente realizar un Blog de Reseñas de Series y Animes. <br/>
Está construido con una arquitectura híbrida que combina **Astro** para la vista pública, con un panel de administración dinámico en **React** para la redacción de contenido.

## 🛠️ Tecnologías Utilizadas

* **Frontend Público:** Astro (Componentes `.astro` y HTML/CSS puro para máxima velocidad).
* **Panel de Edición:** React y BlockNote (para el editor de texto enriquecido WYSIWYG).
* **Backend / Sistema de Archivos:** Node.js (Manejo de peticiones de servidor y escritura en disco con `fs/promises`).
* **Gestor de Paquetes:** pnpm.

## ✨ Funcionalidades Principales

1.  **Grilla de Reseñas:** Visualización rápida de publicaciones en formato tarjeta.
2.  **Panel de Redacción Privado (`/redactar`):** Un entorno de escritura visual que no requiere escribir código.
3.  **Automatización de Markdown:** Al guardar una reseña en el panel, el sistema genera automáticamente el archivo `.md` con el Frontmatter configurado.
4.  **Gestor de Imágenes:** Subida de archivos binarios (imágenes de portada) que se depositan automáticamente en la carpeta de *assets* y se enlazan al post.

## 🚀 Cómo ejecutar el proyecto localmente

1. Clona este repositorio.
2. Instala las dependencias:
   \`\`\`bash
   pnpm install
   \`\`\`
3. Inicia el servidor de desarrollo:
   \`\`\`bash
   pnpm run dev
   \`\`\`
4. Abre tu navegador en `http://localhost:4321/`.

## 📂 Estructura clave del proyecto

* `/src/pages/`: Contiene el enrutamiento principal (`index.astro`, `/home`, `/about`) y la API.
* `/src/pages/api/guardar.ts`: El endpoint que procesa el formulario, guarda la imagen y escribe el archivo `.md`.
* `/src/components/Editor.tsx`: El panel de redacción visual en React.
* `/src/content/blog/`: Donde se guardan (automáticamente) las reseñas generadas en Markdown.
* `/src/assets/`: Carpeta de destino automatizada para las imágenes subidas.

---
*Desarrollado con 🧉 desde Necochea, Argentina.*