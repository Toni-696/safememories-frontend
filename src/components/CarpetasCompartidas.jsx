function CarpetasCompartidas({
    carpetasCompartidas,
    obtenerArchivosDeCarpetaCompartida
}) {
    return (
        <div>
            <h2>Carpetas compartidas conmigo</h2>

            {carpetasCompartidas.length === 0 ? (
                <p>No tienes carpetas compartidas</p>
            ) : (
                <ul>
                    {carpetasCompartidas.map((carpeta) => (
                        <li key={carpeta.id} className="folder-item">
                            <div className="folder-header">
                                <button
                                    className="folder-name-button"
                                    onClick={() => obtenerArchivosDeCarpetaCompartida(carpeta)}
                                    title={carpeta.nombre}
                                >
                                    <span className="folder-icon">📁</span>
                                    {carpeta.nombre}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CarpetasCompartidas;