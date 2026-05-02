//muestra las carpetas del usuario
//si no hay carpetas, muestra un mensaje que diga "No tienes carpetas"
//y si hay carpetas, muestra una lista de carpetas con botones para ver los archivos de cada carpeta
//y un botón para crear una carpeta 
import { useState } from "react";
function Carpetas({
    carpetas,
    nombreCarpeta,
    setNombreCarpeta,
    crearCarpeta,
    obtenerArchivosDeCarpeta,
    renombrarCarpeta,
    borrarCarpeta
}) {
    const [carpetaEditando, setCarpetaEditando] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState("");

    return (
        <div>
            <h2>Mis carpetas</h2>

            {carpetas.length === 0 ? (
                <p>No tienes carpetas</p>
            ) : (
                <ul>
                    {carpetas.map((carpeta) => (
                        <li key={carpeta.id} className="folder-item">
                            <div className="folder-header">

                                <button
                                    className="folder-name-button"
                                    onClick={() => obtenerArchivosDeCarpeta(carpeta)}
                                    title="Mostrar archivos"
                                >
                                    <span className="folder-icon">📁</span>
                                    {carpeta.nombre}
                                </button>

                                <div className="folder-actions">
                                    <button
                                        onClick={() => obtenerArchivosDeCarpeta(carpeta)}
                                        title="Mostrar archivos"
                                    >
                                        👁
                                    </button>

                                    <button
                                        onClick={() => {
                                            setCarpetaEditando(carpeta.id);
                                            setNuevoNombre(carpeta.nombre);
                                        }}
                                        title="Renombrar"
                                    >
                                        ✏
                                    </button>

                                    <button
                                        onClick={() => borrarCarpeta(carpeta.id)}
                                        title="Borrar"
                                    >
                                        🗑
                                    </button>
                                </div>

                            </div>

                            {carpetaEditando === carpeta.id && (
                                <div className="folder-edit">
                                    <input
                                        type="text"
                                        value={nuevoNombre}
                                        onChange={(e) => setNuevoNombre(e.target.value)}
                                    />

                                    <button
                                        onClick={() => {
                                            renombrarCarpeta(carpeta.id, nuevoNombre);
                                            setCarpetaEditando(null);
                                        }}
                                    >
                                        Guardar
                                    </button>

                                    <button onClick={() => setCarpetaEditando(null)}>
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <h3>Crear carpeta</h3>

            <input
                type="text"
                placeholder="Nombre de carpeta"
                value={nombreCarpeta}
                onChange={(e) => setNombreCarpeta(e.target.value)}
            />

            <button onClick={crearCarpeta}>
                Crear
            </button>
        </div>
    );
}

export default Carpetas;