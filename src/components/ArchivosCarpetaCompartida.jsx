import ImagenProtegida from "./ImagenProtegida";

function ArchivosCarpetaCompartida({
    carpetaCompartidaSeleccionada,
    archivosCarpetaCompartida,
    archivosSeleccionadosDescarga,
    setArchivosSeleccionadosDescarga,
    solicitarDescarga
}) {
    if (!carpetaCompartidaSeleccionada) {
        return null;
    }

    const cambiarSeleccion = (archivoId) => {
        if (archivosSeleccionadosDescarga.includes(archivoId)) {
            setArchivosSeleccionadosDescarga(
                archivosSeleccionadosDescarga.filter((id) => id !== archivoId)
            );
        } else {
            setArchivosSeleccionadosDescarga([
                ...archivosSeleccionadosDescarga,
                archivoId
            ]);
        }
    };

    return (
        <div>
            <h2>Archivos compartidos de {carpetaCompartidaSeleccionada.nombre}</h2>

            {archivosCarpetaCompartida.length === 0 ? (
                <p>Esta carpeta compartida está vacía</p>
            ) : (
                <>
                    <div className="file-grid">
                        {archivosCarpetaCompartida.map((archivo) => {
                            const esImagen = archivo.tipo && archivo.tipo.startsWith("image/");
                            const seleccionado = archivosSeleccionadosDescarga.includes(archivo.id);

                            return (
                                <div
                                    key={archivo.id}
                                    className={`file-card ${seleccionado ? "selected-file" : ""}`}
                                >
                                    <label className="select-file">
                                        <input
                                            type="checkbox"
                                            checked={seleccionado}
                                            onChange={() => cambiarSeleccion(archivo.id)}
                                        />
                                        Seleccionar
                                    </label>

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

                                    <p className="file-name">{archivo.nombreOriginal}</p>

                                    <p className="shared-by">
                                        Propietario: {archivo.emailUsuario}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <button onClick={solicitarDescarga}>
                        Solicitar descarga de seleccionados
                    </button>
                </>
            )}
        </div>
    );
}

export default ArchivosCarpetaCompartida;