//muestra los archivos compartidos conmigo, si es que hay   
//si no hay, muestra un mensaje que diga "No tienes archivos compartidos"
//y si hay archivos compartidos, muestra una lista de archivos compartidos con botones para ver y descargar
import ImagenProtegida from "./ImagenProtegida";

function Compartidos({
    archivosCompartidos,
    verArchivo,
    descargarArchivo
}) {
    return (
        <div>
            <h2>Compartidos conmigo</h2>

            {archivosCompartidos.length === 0 ? (
                <p>No tienes archivos compartidos</p>
            ) : (
                <div className="file-grid">
                    {archivosCompartidos.map((archivo) => {
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

                                <p className="file-name">{archivo.nombreOriginal}</p>

                                <p className="shared-by">
                                    Compartido por: {archivo.emailUsuario}
                                </p>

                                <div className="file-extra-actions">
                                    <button onClick={() => verArchivo(archivo.id)} title="Ver">
                                        👁
                                    </button>

                                    <button
                                        onClick={() => descargarArchivo(archivo.id, archivo.nombreOriginal)}
                                        title="Descargar"
                                    >
                                        ⬇
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Compartidos;