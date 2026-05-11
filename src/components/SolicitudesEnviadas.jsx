function SolicitudesEnviadas({
    solicitudesEnviadas,
    descargarArchivo
}) {
    return (
        <div>
            <h2>Mis solicitudes de descarga</h2>

            {solicitudesEnviadas.length === 0 ? (
                <p>No has enviado solicitudes</p>
            ) : (
                solicitudesEnviadas.map((solicitud) => (
                    <div key={solicitud.id} className="request-card">
                        <p>
                            <strong>Propietario:</strong> {solicitud.propietario}
                        </p>

                        <p>
                            <strong>Estado:</strong> {solicitud.estado}
                        </p>

                        <ul>
                            {solicitud.archivos.map((archivo) => (
                                <li key={archivo.id}>
                                    {archivo.nombreOriginal}

                                    {solicitud.estado === "ACEPTADA" && (
                                        <button
                                            onClick={() => descargarArchivo(archivo.id, archivo.nombreOriginal)}
                                            title="Descargar"
                                        >
                                            ⬇
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
}

export default SolicitudesEnviadas;