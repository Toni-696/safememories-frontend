//muestra las carpetas del usuario
//si no hay carpetas, muestra un mensaje que diga "No tienes carpetas"
//y si hay carpetas, muestra una lista de carpetas con botones para ver los archivos de cada carpeta
//y un botón para crear una carpeta 

function Carpetas({
    carpetas,
    nombreCarpeta,
    setNombreCarpeta,
    crearCarpeta,
    obtenerArchivosDeCarpeta,
    renombrarCarpeta,
    borrarCarpeta
}) {
    const [carpetaEditando, setCarpetaEditando] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState("");

    return (
        <div>
            <h2>Mis carpetas</h2>

            {carpetas.length === 0 ? (
                <p>No tienes carpetas</p>
            ) : (
                <ul>
                    {carpetas.map((carpeta) => (
                        <li key={carpeta.id}>
                            <button onClick={() => obtenerArchivosDeCarpeta(carpeta)}>
                                {carpeta.nombre}
                            </button>

                            <button onClick={() => {
                                setCarpetaEditando(carpeta.id);
                                setNuevoNombre(carpeta.nombre);
                            }}>
                                Renombrar
                            </button>

                            <button onClick={() => borrarCarpeta(carpeta.id)}>
                                Borrar
                            </button>

                            {carpetaEditando === carpeta.id && (
                                <div>
                                    <input
                                        type="text"
                                        value={nuevoNombre}
                                        onChange={(e) => setNuevoNombre(e.target.value)}
                                    />

                                    <button onClick={() => {
                                        renombrarCarpeta(carpeta.id, nuevoNombre);
                                        setCarpetaEditando(null);
                                    }}>
                                        Guardar
                                    </button>

                                    <button onClick={() => setCarpetaEditando(null)}>
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <h3>Crear carpeta</h3>

            <input
                type="text"
                placeholder="Nombre de carpeta"
                value={nombreCarpeta}
                onChange={(e) => setNombreCarpeta(e.target.value)}
            />

            <button onClick={crearCarpeta}>
                Crear
            </button>
        </div>
    );
}

export default Carpetas;