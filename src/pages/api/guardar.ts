import fs from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();

        if (!body || !body.titulo || !body.contenido) {
            return new Response(JSON.stringify({ error: "Faltan datos obligatorios" }), { status: 400 });
        }

        // Extraemos la imagen enviada desde el cliente
        const { titulo, contenido, heroImage } = body;

        let nombreLimpio = titulo
            .toLowerCase()
            .trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/\.md$/, '');

        const nombreArchivo = `${nombreLimpio}.md`;
        const ruta = path.join(process.cwd(), 'src/content/blog', nombreArchivo);

        // Si por alguna razón no viene una imagen, aseguramos un fallback seguro
        const imagenPortada = heroImage || '/blog-placeholder-1.jpg';

        // Añadimos la propiedad heroImage al bloque de configuración del Markdown
        const markdownCompleto = `---
title: '${titulo}'
description: 'Reseña redactada desde el panel privado'
pubDate: '${new Date().toISOString()}'
heroImage: '${imagenPortada}'
---

${contenido}`;

        await fs.writeFile(ruta, markdownCompleto, 'utf-8');

        return new Response(JSON.stringify({ mensaje: "Guardado exitoso" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Error al guardar:", error);
        return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
    }
};