import fs from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Procesamos la petición entrante como FormData
    const data = await request.formData();
    const titulo = data.get('titulo') as string;
    const contenido = data.get('contenido') as string;
    const archivoImagen = data.get('heroImage') as File | null;

    if (!titulo || !contenido || !archivoImagen) {
      return new Response(JSON.stringify({ error: "Faltan datos obligatorios o la imagen" }), { status: 400 });
    }

    // 1. Generamos el nombre base usando el slug del título para que todo coincida
    let nombreLimpio = titulo
      .toLowerCase()
      .trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^a-z0-9]+/g, '-')                      
      .replace(/^-+|-+$/g, '')                          
      .replace(/\.md$/, '');                            

    // 2. Extraemos la extensión original de la imagen elegida (.jpg, .webp, etc.)
    const extension = path.extname(archivoImagen.name) || '.jpg';
    const nombreImagenArchivo = `${nombreLimpio}${extension}`;
    
    // Ruta física absoluta donde el backend va a depositar el archivo de la imagen
    const rutaDestinoImagen = path.join(process.cwd(), 'src/assets', nombreImagenArchivo);

    // Convertimos el archivo binario recibido a un Buffer ejecutable por Node.js
    const bytes = await archivoImagen.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Guardamos físicamente la imagen en src/assets/ de forma automática
    await fs.writeFile(rutaDestinoImagen, buffer);

    // 3. Creamos el archivo Markdown (.md) apuntando dinámicamente a la nueva imagen
    const nombreMarkdownArchivo = `${nombreLimpio}.md`;
    const rutaMarkdown = path.join(process.cwd(), 'src/content/blog', nombreMarkdownArchivo);

    // Definimos la ruta relativa exacta que el index del blog necesita para compilar la imagen
    const rutaRelativaFrontmatter = `../../assets/${nombreImagenArchivo}`;

    const markdownCompleto = `---
title: '${titulo}'
description: 'Reseña redactada e indexada de forma automatizada'
pubDate: '${new Date().toISOString()}'
heroImage: '${rutaRelativaFrontmatter}'
---

${contenido}`;

    // Escribimos el post en la colección
    await fs.writeFile(rutaMarkdown, markdownCompleto, 'utf-8');

    return new Response(JSON.stringify({ mensaje: "Guardado e imagen procesada con éxito" }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error crítico en el backend de guardado:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
};