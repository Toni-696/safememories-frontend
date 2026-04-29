import { useEffect, useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [carpetas, setCarpetas] = useState([]);
  const [logueado, setLogueado] = useState(false);
  const [nombreCarpeta, setNombreCarpeta] = useState("");
  const [carpetaSeleccionada, setCarpetaSeleccionada] = useState(null);
  const [archivosCarpeta, setArchivosCarpeta] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [nombreRegistro, setNombreRegistro] = useState("");
  const [emailRegistro, setEmailRegistro] = useState("");
  const [passwordRegistro, setPasswordRegistro] = useState("");
  const [archivosCompartidos, setArchivosCompartidos] = useState([]);
  const [emailCompartir, setEmailCompartir] = useState("");
  const [archivoACompartir, setArchivoACompartir] = useState(null);
  const [usuarioNombre, setUsuarioNombre] = useState("");
  const [usuarioEmail, setUsuarioEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombre = localStorage.getItem("usuarioNombre");
    const email = localStorage.getItem("usuarioEmail");

    if (token) {
      setUsuarioNombre(nombre || "");
      setUsuarioEmail(email || "");

      setLogueado(true);
      obtenerCarpetas(token);
      obtenerArchivosCompartidos(token);
    }
  }, []);

  const login = async () => {
    try {
      const response = await fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuarioNombre", data.nombre);
        localStorage.setItem("usuarioEmail", data.email);

        setUsuarioNombre(data.nombre);
        setUsuarioEmail(data.email);

        setMensaje("Login correcto");
        setLogueado(true);

        obtenerCarpetas(data.token);
        obtenerArchivosCompartidos(data.token);
      } else {
        setMensaje(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      setMensaje("No se pudo conectar con el backend");
    }
  };
  const obtenerCarpetas = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/carpetas/mis-carpetas", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setCarpetas(data);
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al cargar carpetas");
      }

    } catch (error) {
      setMensaje("Error de conexión");
    }
  };

  const crearCarpeta = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/carpetas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nombreCarpeta
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Carpeta creada correctamente");
        setNombreCarpeta("");
        obtenerCarpetas(token);
      } else {
        setMensaje(data.error || "Error al crear carpeta");
      }

    } catch (error) {
      setMensaje("Error de conexión");
    }
  };
  const obtenerArchivosDeCarpeta = async (carpeta) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/carpetas/${carpeta.id}/archivos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setCarpetaSeleccionada(carpeta);
        setArchivosCarpeta(data);
        setMensaje("");
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al cargar archivos de la carpeta");
      }

    } catch (error) {
      setMensaje("Error de conexión");
    }
  };
  const subirArchivo = async () => {
    const token = localStorage.getItem("token");

    if (!archivoSeleccionado) {
      setMensaje("Selecciona un archivo primero");
      return;
    }

    if (!carpetaSeleccionada) {
      setMensaje("Selecciona una carpeta primero");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivoSeleccionado);

    try {
      const response = await fetch(
        `http://localhost:8080/archivos/subir?carpetaId=${carpetaSeleccionada.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensaje("Archivo subido correctamente");
        setArchivoSeleccionado(null);
        obtenerArchivosDeCarpeta(carpetaSeleccionada);
      } else {
        setMensaje(data.error || "Error al subir archivo");
      }

    } catch (error) {
      setMensaje("Error de conexión");
    }
  };
  const verArchivo = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/archivos/ver/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        setMensaje("No se pudo abrir el archivo");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

    } catch (error) {
      setMensaje("Error de conexión");
    }
  };

  const descargarArchivo = async (id, nombreOriginal) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/archivos/descargar/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        setMensaje("No se pudo descargar el archivo");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = nombreOriginal;
      enlace.click();

      URL.revokeObjectURL(url);

    } catch (error) {
      setMensaje("Error de conexión");
    }
  };

  const borrarArchivo = async (id) => {
    const token = localStorage.getItem("token");

    const confirmar = window.confirm("¿Seguro que quieres borrar este archivo?");

    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/archivos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.mensaje || "Archivo borrado correctamente");

        if (carpetaSeleccionada) {
          obtenerArchivosDeCarpeta(carpetaSeleccionada);
        }
      } else {
        setMensaje(data.error || "Error al borrar archivo");
      }

    } catch (error) {
      setMensaje("Error de conexión");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioNombre");
    localStorage.removeItem("usuarioEmail");

    setUsuarioNombre("");
    setUsuarioEmail("");
    setLogueado(false);
    setCarpetas([]);
    setCarpetaSeleccionada(null);
    setArchivosCarpeta([]);
    setMensaje("Sesión cerrada");
  };

  const manejarSesionExpirada = () => {
    localStorage.removeItem("token");
    setLogueado(false);
    setCarpetas([]);
    setCarpetaSeleccionada(null);
    setArchivosCarpeta([]);
    setMensaje("Sesión expirada. Inicia sesión de nuevo.");
  };

  const registrarUsuario = async () => {
    try {
      const response = await fetch("http://localhost:8080/usuarios/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: nombreRegistro,
          email: emailRegistro,
          password: passwordRegistro
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Usuario registrado correctamente. Ya puedes iniciar sesión.");
        setMostrarRegistro(false);
        setNombreRegistro("");
        setEmailRegistro("");
        setPasswordRegistro("");
      } else {
        setMensaje(data.error || data || "Error al registrar usuario");
      }

    } catch (error) {
      setMensaje("Error de conexión");
    }
  };
  const obtenerArchivosCompartidos = async (tokenRecibido = null) => {
    const token = tokenRecibido || localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/archivos/compartidos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setArchivosCompartidos(data);
        setMensaje("");
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al cargar archivos compartidos");
      }

    } catch (error) {
      setMensaje("Error de conexión");
    }
  };
  const compartirArchivo = async () => {
    const token = localStorage.getItem("token");

    if (!archivoACompartir) {
      setMensaje("Selecciona un archivo para compartir");
      return;
    }

    if (!emailCompartir) {
      setMensaje("Introduce el email del usuario");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/archivos/${archivoACompartir.id}/permisos-descarga`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            emailUsuarioAutorizado: emailCompartir
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.mensaje || "Archivo compartido correctamente");
        setEmailCompartir("");
        setArchivoACompartir(null);
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al compartir archivo");
      }

    } catch (error) {
      setMensaje("Error de conexión");
    }
  };
  return (
    <div>
      <h1>SafeMemories</h1>
      {logueado && (
        <p>
          Hola <strong>{usuarioNombre}</strong> ({usuarioEmail})
        </p>
      )}
      {logueado && (
        <button onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      )}
      {!logueado && (
        <div>
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />

          <br /><br />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
          />

          <br /><br />

          <button onClick={login}>Entrar</button>

          <button onClick={() => setMostrarRegistro(!mostrarRegistro)}>
            {mostrarRegistro ? "Volver al login" : "Crear cuenta"}
          </button>
          {mostrarRegistro && !logueado && (
            <div>
              <h2>Registro</h2>

              <input
                type="text"
                placeholder="Nombre"
                value={nombreRegistro}
                onChange={(e) => setNombreRegistro(e.target.value)}
              />

              <br /><br />

              <input
                type="email"
                placeholder="Email"
                value={emailRegistro}
                onChange={(e) => setEmailRegistro(e.target.value)}
              />

              <br /><br />

              <input
                type="password"
                placeholder="Contraseña"
                value={passwordRegistro}
                onChange={(e) => setPasswordRegistro(e.target.value)}
              />

              <br /><br />

              <button onClick={registrarUsuario}>Registrarse</button>
            </div>
          )}
        </div>
      )}

      <p>{mensaje}</p>
      {logueado && (
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
                </li>

              ))}
              {carpetaSeleccionada && (
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
                        </li>
                      ))}
                    </ul>

                  )}
                  <h3>Subir archivo a esta carpeta</h3>

                  <input
                    type="file"
                    onChange={(e) => setArchivoSeleccionado(e.target.files[0])}
                  />

                  <button onClick={subirArchivo}>Subir archivo</button>
                </div>

              )}
            </ul>
          )}
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
      )}
      {logueado && (
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
      )}
      <div>
        <h3>Crear carpeta</h3>

        <input
          type="text"
          placeholder="Nombre de carpeta"
          value={nombreCarpeta}
          onChange={(e) => setNombreCarpeta(e.target.value)}
        />

        <button onClick={crearCarpeta}>Crear</button>
      </div>
    </div>
  );
}

export default App;