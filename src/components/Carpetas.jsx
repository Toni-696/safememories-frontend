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
    borrarCarpeta,
    carpetaACompartir,
    setCarpetaACompartir,
    emailCompartirCarpeta,
    setEmailCompartirCarpeta,
    compartirCarpeta,
    mostrarCrearCarpeta,
    setMostrarCrearCarpeta
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
                                        onClick={() => setCarpetaACompartir(carpeta)}
                                        title="Compartir carpeta"
                                    >
                                        🔗
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

            {carpetaACompartir && (
                <div className="folder-edit">
                    <h3>Compartir carpeta</h3>

                    <p>Carpeta: {carpetaACompartir.nombre}</p>

                    <input
                        type="email"
                        placeholder="Email del usuario"
                        value={emailCompartirCarpeta}
                        onChange={(e) => setEmailCompartirCarpeta(e.target.value)}
                    />

                    <button onClick={compartirCarpeta}>
                        Confirmar compartir
                    </button>

                    <button onClick={() => setCarpetaACompartir(null)}>
                        Cancelar
                    </button>
                </div>
            )}

            <div className="crear-carpeta-container">

                <button
                    className="toggle-crear-carpeta"
                    onClick={() => setMostrarCrearCarpeta(!mostrarCrearCarpeta)}
                >
                    + Crear carpeta
                </button>

                {mostrarCrearCarpeta && (
                    <div className="crear-carpeta-form">
                        <input
                            type="text"
                            placeholder="Nombre de la carpeta"
                            value={nombreCarpeta}
                            onChange={(e) => setNombreCarpeta(e.target.value)}
                        />

                        <button onClick={crearCarpeta}>
                            Crear
                        </button>
                    </div>
                )}

            </div>

            <br></br><br></br><br></br>
        </div>
    );
}

export default Carpetas;