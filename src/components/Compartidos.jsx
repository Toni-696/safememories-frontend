//muestra los archivos compartidos conmigo, si es que hay   
//si no hay, muestra un mensaje que diga "No tienes archivos compartidos"
//y si hay archivos compartidos, muestra una lista de archivos compartidos con botones para ver y descargar
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
                <ul>
                    {archivosCompartidos.map((archivo) => (
                        <li key={archivo.id}>
                            {archivo.nombreOriginal} - Compartido por: {archivo.emailUsuario}

                            <button onClick={() => verArchivo(archivo.id)}>
                                Ver
                            </button>

                            <button onClick={() => descargarArchivo(archivo.id, archivo.nombreOriginal)}>
                                Descargar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Compartidos;