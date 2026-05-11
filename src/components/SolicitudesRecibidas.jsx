import { useState } from "react";

function SolicitudesRecibidas({
    solicitudesRecibidas,
    responderSolicitud
}) {
    const [solicitudAbierta, setSolicitudAbierta] = useState(null);

    const formatearFecha = (fecha) => {
        if (!fecha) return "";

        return new Date(fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
        });
    };

    const toggleSolicitud = (id) => {
        setSolicitudAbierta(solicitudAbierta === id ? null : id);
    };

    return (
        <div>
            <h2>Solicitudes recibidas</h2>

            {solicitudesRecibidas.length === 0 ? (
                <p>No tienes solicitudes de descarga</p>
            ) : (
                <div>
                    {solicitudesRecibidas.map((solicitud) => (
                        <div
                            key={solicitud.id}
                            className={`request-card ${solicitud.estado.toLowerCase()}`}
                            onClick={() => toggleSolicitud(solicitud.id)}
                        >
                            <div className="request-summary">
                                <span>{solicitud.solicitante}</span>
                                <span>{solicitud.estado}</span>
                                <span>{solicitud.archivos.length} archivo(s)</span>
                                <span>{formatearFecha(solicitud.fechaSolicitud)}</span>
                            </div>

                            {solicitudAbierta === solicitud.id && (
                                <div className="request-details">
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
                                        <div className="request-buttons">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    responderSolicitud(solicitud.id, "aceptar");
                                                }}
                                            >
                                                Aceptar
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    responderSolicitud(solicitud.id, "rechazar");
                                                }}
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    )}
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