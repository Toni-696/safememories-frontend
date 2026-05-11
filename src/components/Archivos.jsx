import ImagenProtegida from "./ImagenProtegida";

function Archivos({
    carpetaSeleccionada,
    mostrandoTodasLasImagenes,
    archivosCarpeta,
    setArchivoSeleccionado,
    subirArchivo,
    verArchivo,
    descargarArchivo,
    borrarArchivo,
    setArchivoACompartir,
    archivoACompartir,
    emailCompartir,
    setEmailCompartir,
    compartirArchivo,
    archivoEditando,
    setArchivoEditando,
    nuevoNombreArchivo,
    setNuevoNombreArchivo,
    renombrarArchivo,
    carpetas,
    archivoAMover,
    setArchivoAMover,
    carpetaDestinoId,
    setCarpetaDestinoId,
    moverArchivo
}) {
    if (
        !mostrandoTodasLasImagenes &&
        !carpetaSeleccionada
    ) {
        return null;
    }
    return (
        <div>
            <h2>
                {mostrandoTodasLasImagenes
                    ? "Todas mis imágenes"
                    : carpetaSeleccionada
                        ? `Archivos de ${carpetaSeleccionada.nombre}`
                        : "Selecciona una carpeta"}
            </h2>

            {archivosCarpeta.length === 0 ? (
                <p>
                    {mostrandoTodasLasImagenes
                        ? "No tienes imágenes subidas"
                        : "Esta carpeta está vacía"}
                </p>
            ) : (
                <div className="file-grid">
                    {archivosCarpeta.map((archivo) => {
                        const esImagen = archivo.tipo && archivo.tipo.startsWith("image/");

                        return (
                            <div key={archivo.id} className="file-card">
                                {esImagen ? (
                                    <ImagenProtegida
                                        archivoId={archivo.id}
                                        alt={archivo.nombreOriginal}
                                    />
                                ) : (
                                    <div className="file-placeholder">
                                        📄
                                    </div>
                                )}

                                <p className="file-name">
                                    {archivo.nombreOriginal.replace(/\.[^/.]+$/, "")}
                                </p>

                                <div className="file-extra-actions">
                                    <button onClick={() => verArchivo(archivo.id)} title="Ver">
                                        👁
                                    </button>

                                    <button onClick={() => descargarArchivo(archivo.id, archivo.nombreOriginal)} title="Descargar">
                                        ⬇
                                    </button>

                                    <button onClick={() => borrarArchivo(archivo.id)} title="Borrar">
                                        🗑
                                    </button>

                                    <button
                                        onClick={() => {
                                            setArchivoEditando(archivo.id);
                                            setNuevoNombreArchivo(archivo.nombreOriginal);
                                        }}
                                        title="Renombrar"
                                    >
                                        ✏
                                    </button>

                                    <button onClick={() => setArchivoACompartir(archivo)} title="Compartir">
                                        🔗
                                    </button>

                                    <button onClick={() => setArchivoAMover(archivo)} title="Mover">
                                        📁
                                    </button>
                                </div>

                                {archivoEditando === archivo.id && (
                                    <div>
                                        <input
                                            type="text"
                                            value={nuevoNombreArchivo}
                                            onChange={(e) => setNuevoNombreArchivo(e.target.value)}
                                        />

                                        <button onClick={() => renombrarArchivo(archivo.id)}>
                                            Guardar
                                        </button>

                                        <button onClick={() => setArchivoEditando(null)}>
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {archivoAMover && (
                <div>
                    <h3>Mover archivo</h3>

                    <p>Archivo: {archivoAMover.nombreOriginal}</p>

                    <select
                        value={carpetaDestinoId}
                        onChange={(e) => setCarpetaDestinoId(e.target.value)}
                    >
                        <option value="">Sin carpeta</option>

                        {carpetas.map((carpeta) => (
                            <option key={carpeta.id} value={carpeta.id}>
                                {carpeta.nombre}
                            </option>
                        ))}
                    </select>

                    <button onClick={moverArchivo}>
                        Confirmar mover
                    </button>

                    <button onClick={() => setArchivoAMover(null)}>
                        Cancelar
                    </button>
                </div>
            )}

            {!mostrandoTodasLasImagenes && carpetaSeleccionada && (
                <>
                    <h3>Subir archivo</h3>

                    <input
                        type="file"
                        onChange={(e) => setArchivoSeleccionado(e.target.files[0])}
                    />

                    <button onClick={subirArchivo}>
                        Subir
                    </button>
                </>
            )}

            {archivoACompartir && (
                <div>
                    <h3>Compartir archivo</h3>

                    <p>Archivo: {archivoACompartir.nombreOriginal}</p>

                    <input
                        type="email"
                        placeholder="Email del usuario"
                        value={emailCompartir}
                        onChange={(e) => setEmailCompartir(e.target.value)}
                    />

                    <button onClick={compartirArchivo}>
                        Confirmar compartir
                    </button>

                    <button onClick={() => setArchivoACompartir(null)}>
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
}

export default Archivos;