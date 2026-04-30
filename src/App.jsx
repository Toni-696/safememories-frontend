import { useEffect, useState } from "react";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Carpetas from "./components/Carpetas";
import Archivos from "./components/Archivos";
import Compartidos from "./components/Compartidos";

function App() {
  const [logueado, setLogueado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const [usuarioNombre, setUsuarioNombre] = useState("");
  const [usuarioEmail, setUsuarioEmail] = useState("");

  const [carpetas, setCarpetas] = useState([]);
  const [nombreCarpeta, setNombreCarpeta] = useState("");

  const [carpetaSeleccionada, setCarpetaSeleccionada] = useState(null);
  const [archivosCarpeta, setArchivosCarpeta] = useState([]);

  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const [archivosCompartidos, setArchivosCompartidos] = useState([]);

  const [emailCompartir, setEmailCompartir] = useState("");
  const [archivoACompartir, setArchivoACompartir] = useState(null);

  const [archivoEditando, setArchivoEditando] = useState(null);
  const [nuevoNombreArchivo, setNuevoNombreArchivo] = useState("");

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

  const manejarSesionExpirada = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioNombre");
    localStorage.removeItem("usuarioEmail");

    setUsuarioNombre("");
    setUsuarioEmail("");
    setLogueado(false);
    setCarpetas([]);
    setArchivosCompartidos([]);
    setCarpetaSeleccionada(null);
    setArchivosCarpeta([]);
    setMensaje("Sesión expirada. Inicia sesión de nuevo.");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioNombre");
    localStorage.removeItem("usuarioEmail");

    setUsuarioNombre("");
    setUsuarioEmail("");
    setLogueado(false);
    setCarpetas([]);
    setArchivosCompartidos([]);
    setCarpetaSeleccionada(null);
    setArchivosCarpeta([]);
    setMensaje("Sesión cerrada");
  };

  const obtenerCarpetas = async (tokenRecibido = null) => {
    const token = tokenRecibido || localStorage.getItem("token");

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
    } catch {
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
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al crear carpeta");
      }
    } catch {
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
    } catch {
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
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al subir archivo");
      }
    } catch {
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
    } catch {
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
    } catch {
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
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al borrar archivo");
      }
    } catch {
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
    } catch {
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
    } catch {
      setMensaje("Error de conexión");
    }
  };

  const manejarLoginCorrecto = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuarioNombre", data.nombre);
    localStorage.setItem("usuarioEmail", data.email);

    setUsuarioNombre(data.nombre);
    setUsuarioEmail(data.email);

    setLogueado(true);
    setMensaje("Login correcto");

    obtenerCarpetas(data.token);
    obtenerArchivosCompartidos(data.token);
  };

  const renombrarCarpeta = async (id, nuevoNombre) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/carpetas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nuevoNombre
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Carpeta renombrada correctamente");
        obtenerCarpetas(token);
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al renombrar carpeta");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };

  const borrarCarpeta = async (id) => {
    const token = localStorage.getItem("token");

    const confirmar = window.confirm(
      "¿Seguro que quieres borrar esta carpeta? Los archivos no se borrarán, quedarán sin carpeta."
    );

    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/carpetas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.mensaje || "Carpeta borrada correctamente");
        setCarpetaSeleccionada(null);
        setArchivosCarpeta([]);
        obtenerCarpetas(token);
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al borrar carpeta");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };

  const renombrarArchivo = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/archivos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombreOriginal: nuevoNombreArchivo
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Archivo renombrado correctamente");
        setArchivoEditando(null);
        setNuevoNombreArchivo("");

        if (carpetaSeleccionada) {
          obtenerArchivosDeCarpeta(carpetaSeleccionada);
        }
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al renombrar archivo");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };

  return (
    <div>
      <h1>SafeMemories</h1>

      {logueado && (
        <p>
          Sesión iniciada como: <strong>{usuarioNombre}</strong> ({usuarioEmail})
        </p>
      )}

      {mensaje && <p>{mensaje}</p>}

      {!logueado && !mostrarRegistro && (
        <Login
          onLogin={manejarLoginCorrecto}
          setMensaje={setMensaje}
        />
      )}

      {mostrarRegistro && !logueado && (
        <Registro
          setMensaje={setMensaje}
          onRegistroCorrecto={() => setMostrarRegistro(false)}
        />
      )}

      {!logueado && (
        <button onClick={() => setMostrarRegistro(!mostrarRegistro)}>
          {mostrarRegistro ? "Volver al login" : "Crear cuenta"}
        </button>
      )}

      {logueado && (
        <button onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      )}

      {logueado && (
        <>
          <Carpetas
            carpetas={carpetas}
            nombreCarpeta={nombreCarpeta}
            setNombreCarpeta={setNombreCarpeta}
            crearCarpeta={crearCarpeta}
            obtenerArchivosDeCarpeta={obtenerArchivosDeCarpeta}
            renombrarCarpeta={renombrarCarpeta}
            borrarCarpeta={borrarCarpeta}
          />

          <Archivos
            carpetaSeleccionada={carpetaSeleccionada}
            archivosCarpeta={archivosCarpeta}
            setArchivoSeleccionado={setArchivoSeleccionado}
            subirArchivo={subirArchivo}
            verArchivo={verArchivo}
            descargarArchivo={descargarArchivo}
            borrarArchivo={borrarArchivo}
            setArchivoACompartir={setArchivoACompartir}
            archivoACompartir={archivoACompartir}
            emailCompartir={emailCompartir}
            setEmailCompartir={setEmailCompartir}
            compartirArchivo={compartirArchivo}
            archivoEditando={archivoEditando}
            setArchivoEditando={setArchivoEditando}
            nuevoNombreArchivo={nuevoNombreArchivo}
            setNuevoNombreArchivo={setNuevoNombreArchivo}
            renombrarArchivo={renombrarArchivo}
          />

          <Compartidos
            archivosCompartidos={archivosCompartidos}
            verArchivo={verArchivo}
            descargarArchivo={descargarArchivo}
          />
        </>
      )}
    </div>
  );
}

export default App;