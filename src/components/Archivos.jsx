//Muestra los archivos de la carpeta seleccionada
//si no hay archivos, muestra un mensaje que diga "Esta carpeta está vacía"
//y si hay archivos, muestra una lista de archivos con botones para ver, descargar, borrar y compartir  

function Archivos({
    carpetaSeleccionada,
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
    if (!carpetaSeleccionada) {
        return null;
    }

    return (
        <div>
            <h2>Archivos de {carpetaSeleccionada.nombre}</h2>

            {archivosCarpeta.length === 0 ? (
                <p>Esta carpeta está vacía</p>
            ) : (
                <ul>
                    {archivosCarpeta.map((archivo) => (
                        <li key={archivo.id}>
                            {archivo.nombreOriginal} - {archivo.tipo}

                            <button onClick={() => verArchivo(archivo.id)}>
                                Ver
                            </button>

                            <button onClick={() => descargarArchivo(archivo.id, archivo.nombreOriginal)}>
                                Descargar
                            </button>

                            <button onClick={() => borrarArchivo(archivo.id)}>
                                Borrar
                            </button>

                            <button onClick={() => setArchivoACompartir(archivo)}>
                                Compartir
                            </button>
                            <button onClick={() => setArchivoAMover(archivo)}>
                                Mover
                            </button>
                            <button onClick={() => {
                                setArchivoEditando(archivo.id);
                                setNuevoNombreArchivo(archivo.nombreOriginal);
                            }}>
                                Renombrar
                            </button>

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
                        </li>
                    ))}
                </ul>

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

            {/* SUBIR ARCHIVO */}
            <h3>Subir archivo</h3>

            <input
                type="file"
                onChange={(e) => setArchivoSeleccionado(e.target.files[0])}
            />

            <button onClick={subirArchivo}>
                Subir
            </button>

            {/* COMPARTIR */}
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