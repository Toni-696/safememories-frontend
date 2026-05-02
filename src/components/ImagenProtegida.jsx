import { useEffect, useState } from "react";

//Lee el token de localStorage, manda el header con Authorization
//Crea un blob y luego una URL para poder mostrar la imagen


function ImagenProtegida({ archivoId, alt }) {
    const [urlImagen, setUrlImagen] = useState(null);

    useEffect(() => {
        const cargarImagen = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/archivos/ver/${archivoId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    return;
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                setUrlImagen(url);
            } catch (error) {
                console.error("Error cargando imagen protegida", error);
            }
        };

        cargarImagen();

        return () => {
            if (urlImagen) {
                URL.revokeObjectURL(urlImagen);
            }
        };
    }, [archivoId]);

    if (!urlImagen) {
        return <div className="file-placeholder">Cargando...</div>;
    }

    return (
        <img
            src={urlImagen}
            alt={alt}
            className="file-preview"
        />
    );
}

export default ImagenProtegida;