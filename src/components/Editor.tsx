import { useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function Editor() {
  const editor = useCreateBlockNote();
  const [titulo, setTitulo] = useState("Mi primera reseña");
  const [imagen, setImagen] = useState<File | null>(null);

  const guardarPost = async () => {
    const contenidoMd = await editor.blocksToMarkdownLossy(editor.document);

    if (!imagen) {
      alert('Por favor, selecciona una imagen de portada para la reseña.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido', contenidoMd);
    formData.append('heroImage', imagen); 

    const respuesta = await fetch('/api/guardar', {
      method: 'POST',
      body: formData 
    });

    if (respuesta.ok) {
      alert('¡Reseña guardada e imagen procesada con éxito!');
      // Redirección automática al blog tras guardar correctamente
      window.location.href = '/blog';
    } else {
      alert('Hubo un error al guardar.');
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      
      {/* Botón de regresar */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button 
          onClick={() => window.location.href = '/blog'}
          style={{ 
            background: "none", 
            border: "none", 
            color: "#555", 
            cursor: "pointer", 
            fontSize: "1rem",
            fontWeight: "bold",
            padding: "0",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          ← Regresar al Blog
        </button>
      </div>

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
            style={{ padding: "0.5rem 2rem", fontSize: "1.1rem", cursor: "pointer", backgroundColor: "#18181b", color: "white", border: "none", borderRadius: "4px" }}
          >
            Guardar Reseña
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", color: "#333" }}>Seleccionar Imagen de Portada:</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImagen(e.target.files[0]);
              }
            }}
            style={{ padding: "0.5rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "white" }}
          />
        </div>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", backgroundColor: "white" }}>
        <BlockNoteView editor={editor} />
      </div>

    </div>
  );
}