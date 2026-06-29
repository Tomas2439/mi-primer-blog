import { useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function Editor() {
    const editor = useCreateBlockNote();
    const [titulo, setTitulo] = useState("Mi primera reseña");
    // Inicializamos con una imagen por defecto de la plantilla de Astro
    const [heroImage, setHeroImage] = useState("/blog-placeholder-1.jpg");

    const guardarPost = async () => {
        const contenidoMd = await editor.blocksToMarkdownLossy(editor.document);

        // Enviamos también la propiedad heroImage en el cuerpo de la petición
        const respuesta = await fetch('/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: titulo,
                contenido: contenidoMd,
                heroImage: heroImage
            })
        });

        if (respuesta.ok) {
            alert('¡Reseña guardada con éxito! Revisa la pestaña de Blog.');
        } else {
            alert('Hubo un error al guardar.');
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Título de la reseña"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        style={{ flexGrow: 1, padding: "0.5rem", fontSize: "1.2rem" }}
                    />
                    <button
                        onClick={guardarPost}
                        style={{ padding: "0.5rem 2rem", fontSize: "1.1rem", cursor: "pointer", backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px" }}
                    >
                        Guardar Reseña
                    </button>
                </div>

                {/* Campo para la URL o ruta local de la imagen */}
                <input
                    type="text"
                    placeholder="Ruta de la imagen de portada (ej: /blog-placeholder-2.jpg)"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    style={{ padding: "0.5rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", backgroundColor: "white" }}>
                <BlockNoteView editor={editor} />
            </div>

        </div>
    );
}