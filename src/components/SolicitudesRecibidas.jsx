function SolicitudesRecibidas({
    solicitudesRecibidas,
    responderSolicitud
}) {
    return (
        <div>
            <h2>Solicitudes recibidas</h2>

            {solicitudesRecibidas.length === 0 ? (
                <p>No tienes solicitudes de descarga</p>
            ) : (
                <div>
                    {solicitudesRecibidas.map((solicitud) => (
                        <div key={solicitud.id} className="request-card">
                            <p>
                                <strong>Solicitante:</strong> {solicitud.solicitante}
                            </p>

                            <p>
                                <strong>Estado:</strong> {solicitud.estado}
                            </p>

                            <p>
                                <strong>Archivos solicitados:</strong>
                            </p>

                            <ul>
                                {solicitud.archivos.map((archivo, index) => (
                                    <li key={index}>{archivo}</li>
                                ))}
                            </ul>

                            {solicitud.estado === "PENDIENTE" && (
                                <div>
                                    <button onClick={() => responderSolicitud(solicitud.id, "aceptar")}>
                                        Aceptar
                                    </button>

                                    <button onClick={() => responderSolicitud(solicitud.id, "rechazar")}>
                                        Rechazar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SolicitudesRecibidas;