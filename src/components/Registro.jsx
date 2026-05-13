import { useState } from "react";

function Registro({ onRegistroCorrecto, setMensaje }) {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registrarUsuario = async () => {
        try {
            const response = await fetch("http://localhost:8080/usuarios/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje("Usuario registrado correctamente. Ya puedes iniciar sesión.");

                setNombre("");
                setEmail("");
                setPassword("");

                onRegistroCorrecto();
            } else {
                setMensaje(data.error || data || "Error al registrar usuario");
            }

        } catch (error) {
            setMensaje("Error de conexión");
        }
    };

    return (
        <div className="login-container">

            {/* LADO IZQUIERDO */}
            <div className="login-image">
                <div className="overlay">
                    <h1>SafeMemories</h1>

                    <p>
                        Crea tu cuenta y empieza a guardar y compartir tus recuerdos
                        de forma privada y segura.
                    </p>
                </div>
            </div>

            {/* FORMULARIO */}
            <div className="login-form">

                <h2>Crear cuenta</h2>

                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={registrarUsuario}>
                    Registrarse
                </button>

                <button
                    className="secondary-auth-button"
                    onClick={onRegistroCorrecto}
                >
                    Volver al login
                </button>

            </div>
        </div>
    );
}

export default Registro;