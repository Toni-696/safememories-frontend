//muestra el formulario de registro
//si el registro es correcto, muestra un mensaje que diga "Usuario registrado correctamente. Ya puedes iniciar sesión."
//y si no, muestra un mensaje que diga "Error al registrar usuario"     

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
        <div>
            <h2>Registro</h2>

            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />

            <br /><br />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={registrarUsuario}>Registrarse</button>
        </div>
    );
}

export default Registro;