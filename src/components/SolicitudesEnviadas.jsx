import { useState } from "react";

function SolicitudesEnviadas({
    solicitudesEnviadas,
    descargarArchivo
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
            <h2>Mis solicitudes de descarga</h2>

            {solicitudesEnviadas.length === 0 ? (
                <p>No has enviado solicitudes</p>
            ) : (
                solicitudesEnviadas.map((solicitud) => (
                    <div
                        key={solicitud.id}
                        className={`request-card ${solicitud.estado.toLowerCase()}`}
                        onClick={() => toggleSolicitud(solicitud.id)}
                    >
                        <div className="request-summary">
                            <span>{solicitud.propietario}</span>
                            <span>{solicitud.estado}</span>
                            <span>{solicitud.archivos.length} archivo(s)</span>
                            <span>{formatearFecha(solicitud.fechaSolicitud)}</span>
                        </div>

                        {solicitudAbierta === solicitud.id && (
                            <div className="request-details">
                                <p>
                                    <strong>Propietario:</strong> {solicitud.propietario}
                                </p>

                                <p>
                                    <strong>Estado:</strong> {solicitud.estado}
                                </p>

                                <p>
                                    <strong>Archivos solicitados:</strong>
                                </p>

                                <ul>
                                    {solicitud.archivos.map((archivo) => (
                                        <li key={archivo.id}>
                                            {archivo.nombreOriginal}

                                            {solicitud.estado === "ACEPTADA" && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        descargarArchivo(archivo.id, archivo.nombreOriginal);
                                                    }}
                                                    title="Descargar"
                                                >
                                                    ⬇
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default SolicitudesEnviadas;