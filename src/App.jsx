import { useEffect, useState } from "react";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Carpetas from "./components/Carpetas";
import Archivos from "./components/Archivos";
import Compartidos from "./components/Compartidos";
import "./App.css";
import CarpetasCompartidas from "./components/CarpetasCompartidas";
import ArchivosCarpetaCompartida from "./components/ArchivosCarpetaCompartida";
import SolicitudesRecibidas from "./components/SolicitudesRecibidas";
import SolicitudesEnviadas from "./components/SolicitudesEnviadas";

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

  const [archivoAMover, setArchivoAMover] = useState(null);
  const [carpetaDestinoId, setCarpetaDestinoId] = useState("");
  const [nuevoNombrePerfil, setNuevoNombrePerfil] = useState("");

  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");

  const [mostrarMenuPerfil, setMostrarMenuPerfil] = useState(false);
  const [carpetasCompartidas, setCarpetasCompartidas] = useState([]);
  const [carpetaCompartidaSeleccionada, setCarpetaCompartidaSeleccionada] = useState(null);
  const [archivosCarpetaCompartida, setArchivosCarpetaCompartida] = useState([]);
  const [archivosSeleccionadosDescarga, setArchivosSeleccionadosDescarga] = useState([]);

  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState([]);

  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]);
  const [carpetaACompartir, setCarpetaACompartir] = useState(null);
  const [emailCompartirCarpeta, setEmailCompartirCarpeta] = useState("");
  const [mostrarCrearCarpeta, setMostrarCrearCarpeta] = useState(false);
  const [mostrarSolicitudes, setMostrarSolicitudes] = useState(true);
  const [mostrandoTodasLasImagenes, setMostrandoTodasLasImagenes] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombre = localStorage.getItem("usuarioNombre");
    const email = localStorage.getItem("usuarioEmail");

    if (token) {
      setUsuarioNombre(nombre || "");
      setUsuarioEmail(email || "");
      setLogueado(true);
      obtenerCarpetas(token);
      obtenerTodosLosArchivos(token);
      obtenerArchivosCompartidos(token);
      obtenerCarpetasCompartidas(token);
      obtenerSolicitudesRecibidas(token);
      obtenerSolicitudesEnviadas(token);
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
    setMensaje("");
    setCarpetasCompartidas([]);
    setCarpetaCompartidaSeleccionada(null);
    setArchivosCarpetaCompartida([]);
    setSolicitudesRecibidas([]);
    setSolicitudesEnviadas([]);
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
        setMostrandoTodasLasImagenes(false);
        setCarpetaCompartidaSeleccionada(null);
        setArchivosCarpetaCompartida([]);
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

        if (mostrandoTodasLasImagenes) {
          obtenerTodosLosArchivos(token);
        } else if (carpetaSeleccionada) {
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
    obtenerCarpetasCompartidas(data.token);
    obtenerTodosLosArchivos(data.token);
    obtenerSolicitudesRecibidas(data.token);
    obtenerSolicitudesEnviadas(data.token);
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

        if (mostrandoTodasLasImagenes) {
          obtenerTodosLosArchivos(token);
        } else if (carpetaSeleccionada) {
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

  const moverArchivo = async () => {
    const token = localStorage.getItem("token");

    if (!archivoAMover) {
      setMensaje("Selecciona un archivo para mover");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/archivos/${archivoAMover.id}/mover`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          carpetaId: carpetaDestinoId === "" ? null : Number(carpetaDestinoId)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Archivo movido correctamente");
        setArchivoAMover(null);
        setCarpetaDestinoId("");

        if (mostrandoTodasLasImagenes) {
          obtenerTodosLosArchivos(token);
        } else if (carpetaSeleccionada) {
          obtenerArchivosDeCarpeta(carpetaSeleccionada);
        }

        obtenerCarpetas(token);
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al mover archivo");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };

  const actualizarPerfil = async () => {
    const token = localStorage.getItem("token");

    if (!nuevoNombrePerfil.trim()) {
      setMensaje("El nombre no puede estar vacío");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/usuarios/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nuevoNombrePerfil
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("usuarioNombre", data.nombre);
        setUsuarioNombre(data.nombre);
        setNuevoNombrePerfil("");
        setMensaje("Perfil actualizado correctamente");
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || data || "Error al actualizar perfil");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };

  const cambiarPassword = async () => {
    const token = localStorage.getItem("token");

    if (!passwordActual || !nuevaPassword) {
      setMensaje("Completa ambos campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/usuarios/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          passwordActual,
          nuevaPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Contraseña actualizada correctamente");
        setPasswordActual("");
        setNuevaPassword("");
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al cambiar contraseña");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };
  const obtenerCarpetasCompartidas = async (tokenRecibido = null) => {
    const token = tokenRecibido || localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/carpetas/compartidas", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setCarpetasCompartidas(data);
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al cargar carpetas compartidas");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };
  const obtenerArchivosDeCarpetaCompartida = async (carpeta) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/carpetas/compartidas/${carpeta.id}/archivos`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCarpetaCompartidaSeleccionada(carpeta);
        setArchivosCarpetaCompartida(data);

        // limpiar vista de mis archivos
        setCarpetaSeleccionada(null);
        setArchivosCarpeta([]);
        setMostrandoTodasLasImagenes(false);

        setMensaje("");
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al cargar archivos de carpeta compartida");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };

  const solicitarDescarga = async () => {
    const token = localStorage.getItem("token");

    if (archivosSeleccionadosDescarga.length === 0) {
      setMensaje("Selecciona al menos un archivo");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/solicitudes-descarga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          archivosIds: archivosSeleccionadosDescarga
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.mensaje || "Solicitud enviada correctamente");
        setArchivosSeleccionadosDescarga([]);
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al solicitar descarga");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };

  const obtenerSolicitudesRecibidas = async (tokenRecibido = null) => {
    const token = tokenRecibido || localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/solicitudes-descarga/recibidas", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSolicitudesRecibidas(data);
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al cargar solicitudes");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };

  const responderSolicitud = async (idSolicitud, accion) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/solicitudes-descarga/${idSolicitud}/${accion}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.mensaje || "Solicitud actualizada");
        obtenerSolicitudesRecibidas(token);
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al responder solicitud");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };

  const obtenerSolicitudesEnviadas = async (tokenRecibido = null) => {
    const token = tokenRecibido || localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/solicitudes-descarga/enviadas", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSolicitudesEnviadas(data);
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al cargar solicitudes enviadas");
      }
    } catch {
      setMensaje("Error de conexión");
    }
  };
  const compartirCarpeta = async () => {
    const token = localStorage.getItem("token");

    if (!carpetaACompartir) {
      setMensaje("Selecciona una carpeta para compartir");
      return;
    }

    if (!emailCompartirCarpeta) {
      setMensaje("Introduce el email del usuario");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/carpetas/${carpetaACompartir.id}/compartir`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            email: emailCompartirCarpeta
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.mensaje || "Carpeta compartida correctamente");
        setCarpetaACompartir(null);
        setEmailCompartirCarpeta("");
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al compartir carpeta");
      }

    } catch {
      setMensaje("Error de conexión");
    }
  };

  const obtenerTodosLosArchivos = async (tokenRecibido = null) => {
    const token = tokenRecibido || localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/archivos/mis-archivos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setCarpetaSeleccionada(null);
        setArchivosCarpeta(data);
        setMostrandoTodasLasImagenes(true);
        setCarpetaCompartidaSeleccionada(null);
        setArchivosCarpetaCompartida([]);
        setMensaje("");
      } else if (response.status === 401) {
        manejarSesionExpirada();
      } else {
        setMensaje(data.error || "Error al cargar todos los archivos");
      }
    } catch {
      setMensaje("Error de conexión");
    }
  };

  return (
    <div>
      {!logueado && (
        <div className="auth-page">


          {!mostrarRegistro && (
            <Login
              onLogin={manejarLoginCorrecto}
              setMensaje={setMensaje}
            />
          )}

          {mostrarRegistro && (
            <Registro
              setMensaje={setMensaje}
              onRegistroCorrecto={() => setMostrarRegistro(false)}
            />
          )}

          <button onClick={() => setMostrarRegistro(!mostrarRegistro)}>
            {mostrarRegistro ? "Volver al login" : "Crear cuenta"}
          </button>
        </div>
      )}

      {logueado && (
        <div className="app-container">

          {/* HEADER */}
          <header className="app-header">
            <h1>SafeMemories</h1>

            <div className="header-right">
              <span>
                <strong>{usuarioNombre}</strong> ({usuarioEmail})
              </span>

              <button onClick={() => setMostrarMenuPerfil(!mostrarMenuPerfil)}>
                Perfil
              </button>

              <button onClick={cerrarSesion}>
                Cerrar sesión
              </button>

              {mostrarMenuPerfil && (
                <div className="profile-dropdown">
                  <h3>Editar perfil</h3>

                  <input
                    type="text"
                    placeholder="Nuevo nombre"
                    value={nuevoNombrePerfil}
                    onChange={(e) => setNuevoNombrePerfil(e.target.value)}
                  />

                  <button onClick={actualizarPerfil}>
                    Actualizar nombre
                  </button>

                  <hr />

                  <h3>Cambiar contraseña</h3>

                  <input
                    type="password"
                    placeholder="Contraseña actual"
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                  />

                  <button onClick={cambiarPassword}>
                    Cambiar contraseña
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* CONTENIDO */}
          <div className="app-content">

            {/* IZQUIERDA */}
            <div className="sidebar">
              <button
                className="show-all-button"
                onClick={() => obtenerTodosLosArchivos()}
              >
                Mostrar todas las imágenes
              </button>

              <Carpetas
                carpetas={carpetas}
                nombreCarpeta={nombreCarpeta}
                setNombreCarpeta={setNombreCarpeta}
                crearCarpeta={crearCarpeta}
                obtenerArchivosDeCarpeta={obtenerArchivosDeCarpeta}
                renombrarCarpeta={renombrarCarpeta}
                borrarCarpeta={borrarCarpeta}
                carpetaACompartir={carpetaACompartir}
                setCarpetaACompartir={setCarpetaACompartir}
                emailCompartirCarpeta={emailCompartirCarpeta}
                setEmailCompartirCarpeta={setEmailCompartirCarpeta}
                compartirCarpeta={compartirCarpeta}
                mostrarCrearCarpeta={mostrarCrearCarpeta}
                setMostrarCrearCarpeta={setMostrarCrearCarpeta}
              />

              <CarpetasCompartidas
                carpetasCompartidas={carpetasCompartidas}
                obtenerArchivosDeCarpetaCompartida={obtenerArchivosDeCarpetaCompartida}
              />

            </div>

            {/* CENTRO */}
            <div className="main-content">

              {mensaje && <p className="mensaje">{mensaje}</p>}


              <Archivos
                carpetaSeleccionada={carpetaSeleccionada}
                mostrandoTodasLasImagenes={mostrandoTodasLasImagenes}
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
                carpetas={carpetas}
                archivoAMover={archivoAMover}
                setArchivoAMover={setArchivoAMover}
                carpetaDestinoId={carpetaDestinoId}
                setCarpetaDestinoId={setCarpetaDestinoId}
                moverArchivo={moverArchivo}
              />

              <ArchivosCarpetaCompartida
                carpetaCompartidaSeleccionada={carpetaCompartidaSeleccionada}
                archivosCarpetaCompartida={archivosCarpetaCompartida}
                archivosSeleccionadosDescarga={archivosSeleccionadosDescarga}
                setArchivosSeleccionadosDescarga={setArchivosSeleccionadosDescarga}
                solicitarDescarga={solicitarDescarga}
              />

            </div>

            {/* DERECHA */}
            <aside className="requests-panel">

              <button
                className="toggle-requests"
                onClick={() => setMostrarSolicitudes(!mostrarSolicitudes)}
              >
                {mostrarSolicitudes
                  ? "Ocultar solicitudes"
                  : "Solicitudes"}
              </button>

              {mostrarSolicitudes && (
                <>
                  <SolicitudesRecibidas
                    solicitudesRecibidas={solicitudesRecibidas}
                    responderSolicitud={responderSolicitud}
                  />

                  <SolicitudesEnviadas
                    solicitudesEnviadas={solicitudesEnviadas}
                    descargarArchivo={descargarArchivo}
                  />
                </>
              )}

            </aside>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;